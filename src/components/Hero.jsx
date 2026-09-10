"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 795;
// Enough frames to cover the first stretch of scroll before the background
// loader catches up — the animation becomes interactive after this batch
// instead of waiting for all 795 frames (~67MB) to land first.
const INITIAL_FRAMES = 60;
// Frames in flight at once, both for the initial batch and the background
// stream — keeps the browser's connection pool free for other page assets
// instead of firing all 795 requests simultaneously.
const CONCURRENCY = 6;

const framePath = (index) =>
  `/compressed_images/frame_${String(index + 1).padStart(4, "0")}.webp`;

export default function Hero() {
  const canvasRef = useRef(null);
  const parentRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const images = new Array(FRAME_COUNT);
    const frameState = { currentIndex: 0 };
    let cancelled = false;
    let gsapCtx;
    let scrollAnimationStarted = false;

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawFrame(index) {
      index = Math.max(0, Math.min(images.length - 1, index));
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      setCanvasSize();
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
        gsap.to(frameState, {
          currentIndex: images.length - 1,
          ease: "none",
          scrollTrigger: {
            trigger: parentRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
            pin: pinRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            onUpdate: (self) => {
              drawFrame(Math.floor(frameState.currentIndex));
            },
          },
        });
      });
    }

    function loadFrame(index, onSettled) {
      return new Promise((resolve) => {
        const img = new Image();
        const onSettle = () => {
          onSettled?.(index);
          resolve();
        };
        img.onload = onSettle;
        img.onerror = onSettle;
        // Frame 0 is the LCP-critical asset — hint the browser to fetch it
        // ahead of the rest of the initial batch.
        if (index === 0 && "fetchPriority" in img) {
          img.fetchPriority = "high";
        }
        img.src = framePath(index);
        images[index] = img;
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

    // Streams the remaining frames in small batches during idle time so
    // scrolling, hydration, and other page work stay uninterrupted.
    function loadRestInBackground() {
      let cursor = INITIAL_FRAMES;

      function scheduleNext() {
        if (cancelled || cursor >= FRAME_COUNT) return;
        const run = () => {
          if (cancelled) return;
          const end = Math.min(cursor + CONCURRENCY, FRAME_COUNT);
          const batchStart = cursor;
          cursor = end;
          loadRange(batchStart, end, CONCURRENCY).then(scheduleNext);
        };
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 1000 });
        } else {
          setTimeout(run, 150);
        }
      }

      scheduleNext();
    }

    // Frame 0 draws (and the scroll animation goes live) the moment it
    // individually finishes, rather than waiting on the whole initial
    // batch — on a slow connection that difference is the gap between a
    // blank hero for many seconds and an immediately visible, scrubbable one.
    // Frames scrolled to before they've loaded simply hold the last drawn
    // frame (see the guard in drawFrame) until they arrive.
    function handleInitialFrameSettled(index) {
      if (index === 0 && !cancelled) {
        drawFrame(0);
        startScrollAnimation();
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
      window.removeEventListener("resize", onResize);
      gsapCtx?.revert();
    };
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-ink text-surface">
      <div ref={parentRef} className="relative h-[700vh] w-full">
        <div ref={pinRef} className="h-screen w-full">
          <canvas ref={canvasRef} className="h-screen w-full" />
        </div>
      </div>
    </section>
  );
}
