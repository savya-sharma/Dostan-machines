"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatPct(value) {
  return `${String(Math.round(value)).padStart(2, "0")}%`;
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

export default function HeroLoader({ progress, ready, onExitComplete }) {
  const rootRef = useRef(null);
  const brandRef = useRef(null);
  const counterRef = useRef(null);
  const barTrackRef = useRef(null);
  const barFillRef = useRef(null);
  const displayValueRef = useRef({ value: 0 });
  const queueRef = useRef([]);
  const processingRef = useRef(false);
  const reachedIndexRef = useRef(-1);
  const hasStartedCountRef = useRef(false);
  const hasEnteredRef = useRef(false);
  const hasExitedRef = useRef(false);
  const [displayText, setDisplayText] = useState(formatPct(0));

  // Entrance — a simple fade in, once. No per-character choreography.
  useEffect(() => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    const ctx = gsap.context(() => {
      const targets = [brandRef.current, counterRef.current, barTrackRef.current];
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1 });
        return;
      }
      gsap.set(targets, { opacity: 0 });
      gsap.to(targets, { opacity: 1, duration: 0.4, ease: "power2.out" });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  function finalizeExit() {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    if (prefersReducedMotion()) {
      onExitComplete?.();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => onExitComplete?.() });
    tl.to([brandRef.current, counterRef.current, barTrackRef.current], {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    }).to(
      rootRef.current,
      { opacity: 0, scale: 1.015, duration: 0.55, ease: "power2.inOut" },
      "+=0.05"
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
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 z-[70] bg-ink">
      <div
        ref={brandRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4"
      >
        <Image
          src="/logos/logo-01.svg"
          alt=""
          width={80}
          height={77}
          className="h-24 w-auto sm:h-28"
        />
        <p className="text-lg font-medium text-accent sm:text-xl">Dostan Machines</p>
      </div>

      {/* Full-width wrapper so the bar's own width is never constrained by
          the counter's — only their vertical stacking (and the counter's
          right inset) live here, via flex flow rather than a guessed
          pixel offset, so the bar stays flush under the counter at any
          viewport width or clamp()-resolved font size. */}
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-end gap-3 sm:bottom-8">
        <div
          ref={counterRef}
          className="pr-8 font-mono tracking-wide text-surface sm:pr-10"
          style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
        >
          {displayText}
        </div>

        <div ref={barTrackRef} className="h-px w-full overflow-hidden bg-surface/20">
          <div
            ref={barFillRef}
            className="h-full w-full origin-left bg-[#D71920]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
