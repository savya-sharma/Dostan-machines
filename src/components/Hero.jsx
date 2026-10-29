"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroLoader from "./HeroLoader";
import DiwaliOnly from "./festival/diwali/DiwaliOnly";
import DiwaliHeroAccents from "./festival/diwali/DiwaliHeroAccents";

// The sequence starts at frame_0021.webp (frames 1-20 are skipped) and still
// runs through the final frame_0795.webp — every index below is relative to
// this first frame, so nothing else about loading/playback changes.
const FIRST_FRAME = 21;
const LAST_FRAME = 795;
const FRAME_COUNT = LAST_FRAME - FIRST_FRAME + 1;
// Enough frames to cover the first stretch of scroll before the background
// loader catches up — the loader stays up until this whole batch is loaded
// and decoded, instead of waiting for all 795 frames to land first.
const INITIAL_FRAMES = 60;
// Frames in flight at once, both for the initial batch and the background
// stream — keeps the browser's connection pool free for other page assets
// instead of firing all 795 requests simultaneously.
const CONCURRENCY = 6;
// The loader's counter only ever displays these milestones (kept in sync
// with HeroLoader's own copy of the same list) — each one is reached only
// once its share of the initial batch has actually settled, never sooner.
const CRITICAL_MILESTONES = [45, 65, 88, 100];
// Backstop so a stalled or failed frame can never leave the loader stuck on
// screen forever.
const CRITICAL_TIMEOUT_MS = 30000;
// Canvas backing-store resolution cap — enough for the 1920×1080 frames to
// stay sharp on high-DPI screens without oversizing the canvas beyond them.
const MAX_DPR = 2;
// Source resolution of every frame. The canvas never needs more backing
// pixels than the frame can actually fill (see setCanvasSize).
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;

const framePath = (index) =>
  `/frames/frame_${String(index + FIRST_FRAME).padStart(4, "0")}.webp`;

// The frame sequence finishes at this share of the pinned scroll range; the
// rest holds the final frame, so the hero never releases into the next
// section before the animation has played out.
const SEQUENCE_END = 0.85;
// Frames track the scroll position exactly (no extra scrub lag), which is
// what guarantees the last frame is showing before the hero releases, even
// on a fast flick. Motion stays smooth: Lenis already eases wheel scrolling
// on desktop, and touch scrolling has its own momentum on phones.
const SCRUB_SMOOTHING = true;

const noopSubscribe = () => () => {};

export default function Hero() {
  const canvasRef = useRef(null);
  const parentRef = useRef(null);
  const pinRef = useRef(null);
  const [criticalProgress, setCriticalProgress] = useState(0);
  const [criticalReady, setCriticalReady] = useState(false);
  // True only while this render is part of the initial page load (server
  // render + hydration); false when Hero mounts after a client-side
  // navigation, e.g. clicking the navbar logo. The loader belongs to the
  // first visit only — returning to Home goes straight to the hero.
  const isInitialLoad = useSyncExternalStore(
    noopSubscribe,
    () => false,
    () => true
  );
  const [showLoader, setShowLoader] = useState(isInitialLoad);

  // Emits a <link rel="preload" as="image" fetchpriority="high"> into the
  // document <head> during the server render itself, so the browser's HTML
  // preload scanner can start fetching the LCP frame immediately — in
  // parallel with the JS bundle download — instead of waiting for
  // hydration to run the effect below and issue a `new Image()` request.
  // On a throttled connection that's the difference between frame 0
  // starting to download at ~150ms vs. only after the ~2s it takes the
  // page's JS to finish loading and execute.
  preload(framePath(0), { as: "image", fetchPriority: "high" });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Phones fire resize events whenever the address bar shows or hides
    // while scrolling; refreshing ScrollTrigger on those would make the
    // pinned hero jump. Real orientation/width changes still refresh.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const images = new Array(FRAME_COUNT);
    const frameState = { currentIndex: 0 };
    let cancelled = false;
    let gsapCtx;
    let scrollAnimationStarted = false;
    let initialSettledCount = 0;
    let criticalDone = false;
    let lastDrawnIndex = -1;

    function markCriticalDone() {
      if (criticalDone || cancelled) return;
      criticalDone = true;
      setCriticalProgress(100);
      setCriticalReady(true);
    }

    // Never leaves the loader stuck if a critical frame stalls or fails.
    const criticalTimeout = setTimeout(markCriticalDone, CRITICAL_TIMEOUT_MS);

    // Only reallocates the canvas when the viewport actually changed —
    // assigning width/height clears and reallocates it, which on every
    // scroll update is wasted work. Returns whether it resized.
    //
    // The frame is drawn to cover the viewport at `cover` CSS px per frame
    // px; a backing store denser than 1 / cover only upsamples the same
    // source pixels (e.g. 2880×1800 on a 1440×900 @2x screen), costing fill
    // time on every scroll update with no added detail.
    //
    // Sized from the canvas's own CSS box (h-screen), not innerHeight: on
    // phones innerHeight changes as the address bar shows and hides while
    // 100vh doesn't, and a backing store with a different aspect ratio than
    // the box would be stretched to fit it.
    function setCanvasSize() {
      const cssWidth = canvas.clientWidth || window.innerWidth;
      const cssHeight = canvas.clientHeight || window.innerHeight;
      const cover = Math.max(cssWidth / FRAME_WIDTH, cssHeight / FRAME_HEIGHT);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR, Math.max(1, 1 / cover));
      const width = Math.round(cssWidth * dpr);
      const height = Math.round(cssHeight * dpr);
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      return true;
    }

    function drawFrame(index) {
      index = Math.max(0, Math.min(images.length - 1, index));
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      // Scrub fires many updates per frame index — skip repainting the
      // same frame unless a resize cleared the canvas.
      if (!setCanvasSize() && index === lastDrawnIndex) return;
      lastDrawnIndex = index;
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }

    function startScrollAnimation() {
      if (scrollAnimationStarted) return;
      scrollAnimationStarted = true;
      gsapCtx = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: parentRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: SCRUB_SMOOTHING,
              pin: pinRef.current,
              pinSpacing: false,
              anticipatePin: 1,
            },
          })
          .to(frameState, {
            currentIndex: images.length - 1,
            ease: "none",
            duration: SEQUENCE_END,
            // On the tween, not the ScrollTrigger: the trigger's onUpdate
            // only fires when the scroll position changes, but scrub keeps
            // easing currentIndex after scrolling stops — drawing here paints
            // every one of those steps, so the hero comes to rest on the
            // frame that matches the scroll position.
            onUpdate: () => drawFrame(Math.floor(frameState.currentIndex)),
          })
          // Hold on the final frame for the rest of the pin.
          .to({}, { duration: 1 - SEQUENCE_END });
      });
    }

    // Settles once the frame is downloaded *and* decoded (off the main
    // thread), so drawing it later never stalls a scroll update on a
    // synchronous decode. Errors settle too, so nothing waits on them.
    function loadFrame(index, onSettled) {
      const img = new Image();
      img.decoding = "async";
      // Frame 0 is the LCP-critical asset — hint the browser to fetch it
      // ahead of the rest of the initial batch.
      if (index === 0 && "fetchPriority" in img) {
        img.fetchPriority = "high";
      }
      img.src = framePath(index);
      images[index] = img;
      return img
        .decode()
        .catch(() => {})
        .then(() => {
          if (cancelled) return;
          onSettled?.(index);
          // A frame scrolled to before it arrived was skipped by drawFrame —
          // paint it now that it's here.
          if (scrollAnimationStarted && index === Math.floor(frameState.currentIndex)) {
            drawFrame(index);
          }
        });
    }

    // Loads [start, end) with at most `concurrency` requests in flight.
    async function loadRange(start, end, concurrency, onSettled) {
      let cursor = start;
      async function worker() {
        while (cursor < end && !cancelled) {
          const i = cursor++;
          await loadFrame(i, onSettled);
        }
      }
      await Promise.all(
        Array.from({ length: Math.min(concurrency, Math.max(end - start, 0)) }, worker)
      );
    }

    // Next unrequested frame at or ahead of the current scroll position
    // (falling back to any skipped ones behind it), so a fast scroll pulls
    // the frames it's about to need first instead of queueing behind
    // frames it has already passed.
    function nextFrameToLoad() {
      const from = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(frameState.currentIndex)));
      for (let i = from; i < FRAME_COUNT; i++) if (!images[i]) return i;
      for (let i = from - 1; i >= 0; i--) if (!images[i]) return i;
      return -1;
    }

    // Streams the remaining frames with a fixed number in flight. Downloads
    // and decodes run off the main thread, so scrolling stays uninterrupted.
    function loadRestInBackground() {
      async function worker() {
        while (!cancelled) {
          const i = nextFrameToLoad();
          if (i === -1) return;
          await loadFrame(i);
        }
      }
      for (let w = 0; w < CONCURRENCY; w++) worker();
    }

    // Frame 0 draws (and the scroll animation goes live) the moment it
    // individually finishes, rather than waiting on the whole initial
    // batch — on a slow connection that difference is the gap between a
    // blank hero for many seconds and an immediately visible, scrubbable one.
    // Frames scrolled to before they've loaded simply hold the last drawn
    // frame (see the guard in drawFrame) until they arrive.
    function handleInitialFrameSettled(index) {
      if (cancelled) return;

      if (index === 0) {
        drawFrame(0);
        startScrollAnimation();
      }

      // Errored frames still "settle" (loadFrame swallows decode errors),
      // so a failed frame can't stall progress — it just counts and moves
      // on. Each milestone maps to an equal share of the initial batch, and
      // the loader is only released once the whole batch is ready to draw.
      if (criticalDone) return;
      initialSettledCount += 1;
      const reached = Math.floor(
        (initialSettledCount * CRITICAL_MILESTONES.length) / INITIAL_FRAMES
      );
      if (reached > 0) setCriticalProgress(CRITICAL_MILESTONES[reached - 1]);
      if (initialSettledCount >= INITIAL_FRAMES) {
        clearTimeout(criticalTimeout);
        markCriticalDone();
      }
    }

    loadRange(0, INITIAL_FRAMES, CONCURRENCY, handleInitialFrameSettled).then(() => {
      if (cancelled) return;
      loadRestInBackground();
    });

    function onResize() {
      drawFrame(Math.floor(frameState.currentIndex));
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      clearTimeout(criticalTimeout);
      window.removeEventListener("resize", onResize);
      gsapCtx?.revert();
    };
  }, []);

  const handleLoaderExitComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-ink text-surface">
      <div ref={parentRef} className="relative h-[700vh] w-full">
        <div ref={pinRef} className="relative h-screen w-full">
          <canvas ref={canvasRef} className="h-screen w-full" />
          <DiwaliOnly>
            <DiwaliHeroAccents play={!showLoader} />
          </DiwaliOnly>
        </div>
      </div>

      {showLoader && (
        <HeroLoader
          progress={criticalProgress}
          ready={criticalReady}
          onExitComplete={handleLoaderExitComplete}
        />
      )}
    </section>
  );
}
