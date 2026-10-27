"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatPct(value) {
  return String(Math.round(value)).padStart(2, "0");
}

// The counter only ever visually lands on these milestones, in order, each
// reached with a brief count-up + a short hold — a deliberate, unhurried
// pace instead of snapping straight to whatever real value just arrived.
// `progress`/`ready` are still the real signals from the caller (Hero's
// actual frame-loading state); this only paces how the number gets there
// on screen, and 100% is never queued until `ready` is genuinely true.
const MILESTONES = [45, 65, 88, 100];
const COUNT_DURATION = 0.7;
const HOLD_DURATION = 0.4;
// A brief beat on 00% before the first count-up begins, so the starting
// state actually registers instead of being skipped past.
const START_PAUSE = 0.6;

const WORDMARK = "DOSTAN MACHINES";

export default function HeroLoader({ progress, ready, onExitComplete }) {
  const rootRef = useRef(null);
  const brandRef = useRef(null);
  const logoRef = useRef(null);
  const counterRef = useRef(null);
  const barTrackRef = useRef(null);
  const barFillRef = useRef(null);
  const displayValueRef = useRef({ value: 0 });
  const queueRef = useRef([]);
  const processingRef = useRef(false);
  const reachedIndexRef = useRef(-1);
  const hasStartedCountRef = useRef(false);
  const hasExitedRef = useRef(false);
  const [displayText, setDisplayText] = useState(formatPct(0));

  // Entrance, once: the logo settles in, the wordmark's letters rise out of
  // their mask on a short stagger, then the progress line draws out from
  // the centre and the counter fades up.
  // No run-once guard: if the effect re-runs (React Strict Mode), the
  // cleanup's ctx.revert() resets everything and the entrance replays.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordmark = brandRef.current.querySelector("[data-wordmark]");
      const letters = wordmark.querySelectorAll("[data-letter]");
      if (prefersReducedMotion()) {
        gsap.set([logoRef.current, wordmark, counterRef.current, barTrackRef.current], {
          autoAlpha: 1,
        });
        return;
      }
      gsap
        .timeline()
        .set(wordmark, { autoAlpha: 1 })
        .set(letters, { yPercent: 110 })
        .fromTo(
          logoRef.current,
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        )
        .fromTo(
          letters,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.025 },
          "-=0.55"
        )
        .fromTo(
          barTrackRef.current,
          { autoAlpha: 1, scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "expo.out" },
          "-=0.5"
        )
        .fromTo(
          counterRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "<"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Exit: the content lifts away, then the whole screen wipes upward like a
  // curtain, uncovering the page beneath.
  function finalizeExit() {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    if (prefersReducedMotion()) {
      onExitComplete?.();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => onExitComplete?.() });
    tl.to([brandRef.current, counterRef.current], {
      autoAlpha: 0,
      y: -16,
      duration: 0.45,
      ease: "power2.in",
      stagger: 0.05,
    }).to(
      rootRef.current,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "expo.inOut",
      },
      "-=0.1"
    );
  }

  function processQueue() {
    if (processingRef.current) return;
    const next = queueRef.current.shift();
    if (next === undefined) return;
    processingRef.current = true;

    const advance = () => {
      processingRef.current = false;
      if (next >= 100) {
        finalizeExit();
      } else {
        processQueue();
      }
    };

    if (prefersReducedMotion()) {
      displayValueRef.current.value = next;
      setDisplayText(formatPct(next));
      if (barFillRef.current) gsap.set(barFillRef.current, { scaleX: next / 100 });
      advance();
      return;
    }

    const startDelay = hasStartedCountRef.current ? 0 : START_PAUSE;
    hasStartedCountRef.current = true;

    gsap.to(displayValueRef.current, {
      value: next,
      delay: startDelay,
      duration: COUNT_DURATION,
      ease: "power2.out",
      onUpdate: () => {
        const v = displayValueRef.current.value;
        setDisplayText(formatPct(v));
        if (barFillRef.current) gsap.set(barFillRef.current, { scaleX: v / 100 });
      },
      onComplete: () => {
        gsap.delayedCall(HOLD_DURATION, advance);
      },
    });
  }

  // Queues any newly-reached real milestones — never skips ahead of what
  // the caller has actually reported, and never queues the final 100%
  // milestone until `ready` is genuinely true.
  useEffect(() => {
    const idx = MILESTONES.indexOf(progress);
    if (idx === -1 || idx <= reachedIndexRef.current) return;
    const isFinal = idx === MILESTONES.length - 1;
    if (isFinal && !ready) return;

    for (let i = reachedIndexRef.current + 1; i <= idx; i++) {
      queueRef.current.push(MILESTONES[i]);
    }
    reachedIndexRef.current = idx;
    processQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, ready]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[70] bg-ink bg-[radial-gradient(ellipse_at_center,rgba(245,245,243,0.05)_0%,transparent_65%)]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div
        ref={brandRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      >
        <Image
          ref={logoRef}
          src="/logos/logo-01.svg"
          alt=""
          width={80}
          height={77}
          priority
          className="invisible h-16 w-auto sm:h-20"
        />

        <p
          data-wordmark
          className="invisible mt-7 flex overflow-hidden pl-[0.5em] text-[0.7rem] font-medium tracking-[0.5em] text-surface/85 sm:text-xs">
          {Array.from(WORDMARK).map((char, i) => (
            <span key={i} data-letter className="inline-block">
              {char === " " ? " " : char}
            </span>
          ))}
        </p>

        {/* Progress line: the track draws in on entrance; the red fill
            tracks the counter. */}
        <div
          ref={barTrackRef}
          className="invisible mt-6 h-px w-40 overflow-hidden bg-surface/15 sm:w-48"
        >
          <div
            ref={barFillRef}
            className="h-full w-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      <div
        ref={counterRef}
        className="invisible absolute bottom-6 right-8 flex items-start font-light leading-none text-surface tabular-nums sm:bottom-8 sm:right-10"
        style={{ fontSize: "clamp(3.5rem, 7vw, 6.5rem)" }}
      >
        {displayText}
        <span className="ml-1 mt-[0.35em] text-[0.3em] font-normal text-accent">%</span>
      </div>
    </div>
  );
}
