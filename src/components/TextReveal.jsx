"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Site-wide line-by-line text reveal. Every h1/h2 inside <main> takes part
// automatically, plus any element marked `data-reveal` (used sparingly, on
// lead paragraphs), plus the footer's headings, links and text. Opt a
// subtree out with `data-reveal-skip`. Elements inside a
// `data-reveal-group` share one scroll trigger and reveal in sequence.
//
// - On a route change, text already in view reveals immediately — lines
//   rise out of a mask, ~0.4s overall — so the new page arrives with motion
//   but no blank screen or delay.
// - Text further down reveals once, line by line, as it approaches the
//   viewport (ScrollTrigger).
// - On the very first load, text already on screen is left untouched (it's
//   painted before hydration, so hiding it would flash); below-the-fold text
//   still reveals on scroll.
const TARGETS =
  "main h1, main h2, main [data-reveal], footer h2, footer p, footer a, footer [data-reveal]";
const SKIP = "[data-reveal-skip]";
// Anything starting within this fraction of the viewport height (measured
// from the top of the page) counts as "in view" on arrival.
const IN_VIEW = 0.9;

const LINE = { yPercent: 100, autoAlpha: 0, ease: "power3.out" };
const ROUTE = { duration: 0.4, stagger: 0.04, gap: 0.05, maxDelay: 0.2 };
const SCROLL = { duration: 0.7, stagger: 0.07, start: "top 88%", groupGap: 0.04, groupMaxDelay: 0.5 };
// `data-reveal="chars"` (the footer wordmark): letters rise one by one out
// of the line mask instead of whole lines.
const CHARS = { duration: 0.8, stagger: 0.035, ease: "power4.out" };

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function TextReveal() {
  const pathname = usePathname();
  // Same value on mount (including Strict Mode's second effect run), so
  // only real navigations count as route changes.
  const prevPathnameRef = useRef(pathname);

  // Layout effect: on a route change the new page is committed but not yet
  // painted, so its text is hidden before it can ever show un-animated.
  useLayoutEffect(() => {
    const isRouteChange = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const main = document.querySelector("main");
    if (!main) return;

    const splits = [];
    const ctx = gsap.context(() => {
      const found = [...document.querySelectorAll(TARGETS)].filter(
        (el) => !el.closest(SKIP) && el.textContent.trim()
      );
      // Never split an element twice (e.g. a marked paragraph inside a
      // heading) — the outermost one owns the reveal.
      const targets = found.filter((el) => !found.some((o) => o !== el && o.contains(el)));

      // Positions are taken relative to <main>, not the viewport: during a
      // route change the window may still hold the previous page's scroll.
      const mainTop = main.getBoundingClientRect().top;
      const fold = window.innerHeight * IN_VIEW;
      let routeIndex = 0;
      const groupIndex = new Map();

      targets.forEach((el) => {
        const inView = el.getBoundingClientRect().top - mainTop < fold;
        if (inView && !isRouteChange) return;

        let timing;
        if (inView) {
          timing = {
            duration: ROUTE.duration,
            stagger: ROUTE.stagger,
            delay: Math.min(routeIndex++ * ROUTE.gap, ROUTE.maxDelay),
          };
        } else {
          const group = el.closest("[data-reveal-group]");
          const index = group ? (groupIndex.get(group) ?? 0) : 0;
          if (group) groupIndex.set(group, index + 1);
          timing = {
            duration: SCROLL.duration,
            stagger: SCROLL.stagger,
            delay: Math.min(index * SCROLL.groupGap, SCROLL.groupMaxDelay),
            scrollTrigger: { trigger: group ?? el, start: SCROLL.start, once: true },
          };
        }

        // Justified text can't be split into per-line blocks without losing
        // its justification, and flex rows (icon links, stacked blocks)
        // don't split cleanly — those rise in as one block instead.
        const style = getComputedStyle(el);
        if (style.textAlign === "justify" || style.display.includes("flex")) {
          gsap.from(el, { y: 16, autoAlpha: 0, ease: LINE.ease, ...timing, stagger: 0 });
          return;
        }

        const byChar = el.dataset.reveal === "chars";
        let played = false;
        splits.push(
          SplitText.create(el, {
            type: byChar ? "lines,chars" : "lines",
            mask: "lines",
            // Re-splits when fonts load or the width changes, so lines stay
            // correct on resize/rotation. Once played, re-splits stay static.
            autoSplit: true,
            onSplit: (self) => {
              if (played) return;
              return gsap.from(byChar ? self.chars : self.lines, {
                ...LINE,
                ...timing,
                ...(byChar && CHARS),
                onComplete: () => {
                  played = true;
                },
              });
            },
          })
        );
      });
    });

    return () => {
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, [pathname]);

  return null;
}
