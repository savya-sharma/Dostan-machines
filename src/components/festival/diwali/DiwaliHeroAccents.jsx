"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightSweep from "./LightSweep";
import YantraMandala from "./YantraMandala";
import GoldParticles from "./GoldParticles";
import { DIWALI } from "./palette";

// Diwali layer over the hero's frame canvas (render inside <DiwaliOnly>,
// within the pinned hero box so it travels with the frames). The frames,
// their timing and their loading are untouched; everything here is an
// overlay that ignores the pointer.
//
// - Warm sweep: a broad band of amber light crosses the machinery every few
//   seconds. Soft-light blending warms the bright metal while the dark
//   background stays dark — no global tint, no per-frame processing.
// - Yantra: the loader's mandala settles, large and faint, into the
//   bottom-left negative space; a light travels its outer ring and a few
//   sparks rise where it passes.
// - Edge filigree: a fine ornamental line draws itself up the right edge.
//
// The opening frames are a full-bleed close-up of the plant reaching every
// corner, so the yantra and filigree only arrive (with the scroll) once the
// sequence moves into its darker scenes with open edges.

const ENTER_START = "top+=900 top";
const ENTER_END = "top+=1900 top";
const LIGHT_LOOP = 9; // seconds per lap of the yantra's ring

function EdgeFiligree() {
  // A vertical rule with lotus nodes and small side scrolls, drawn in a
  // 28×400 box; every stroke can be drawn in with its dash offset.
  const nodes = [60, 140, 220, 300];
  const line = {
    fill: "none",
    stroke: DIWALI.gold,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    // No non-scaling stroke: the dash-offset draw-in needs user units.
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    "data-edge-line": "",
  };
  return (
    <svg viewBox="0 0 28 400" preserveAspectRatio="xMidYMid meet" className="h-full w-full overflow-visible" aria-hidden="true">
      <path d="M14 396V4" {...line} strokeWidth="1" strokeOpacity="0.85" />
      <path d="M9 396V40" {...line} strokeWidth="0.6" strokeOpacity="0.45" />
      {nodes.map((y) => (
        <g key={y}>
          <path d={`M14 ${y}c-6-5-6-11 0-15c6 4 6 10 0 15z`} {...line} strokeWidth="0.9" />
          <path d={`M14 ${y + 10}c5 2 9 6 9 11c-4 0-7-3-9-6M14 ${y + 10}c-5 2-9 6-9 11c4 0 7-3 9-6`} {...line} strokeWidth="0.7" strokeOpacity="0.7" />
        </g>
      ))}
      <path d="M14 4c-4-2-4-6 0-8c4 2 4 6 0 8z" {...line} strokeWidth="0.9" />
    </svg>
  );
}

export default function DiwaliHeroAccents({ play }) {
  const rootRef = useRef(null);
  const yantraRef = useRef(null);
  const edgeRef = useRef(null);
  const burstId = useRef(0);
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const yantra = yantraRef.current;
    const edge = edgeRef.current;
    const heroScroll = root?.closest("section")?.firstElementChild;
    if (!root || !heroScroll) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const scrub = { trigger: heroScroll, start: ENTER_START, end: ENTER_END, scrub: true };
      const edgeLines = edge.querySelectorAll("[data-edge-line]");

      // Arrive with the scroll, once the opening close-up has passed.
      gsap.fromTo(yantra, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, ease: "none", scrollTrigger: scrub });
      gsap.fromTo(edge, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", scrollTrigger: scrub });
      if (reduced) {
        gsap.set(edgeLines, { strokeDashoffset: 0 });
        return;
      }
      // The filigree draws up from the bottom edge as you scroll in.
      gsap.to(edgeLines, { strokeDashoffset: 0, ease: "none", stagger: 0.04, scrollTrigger: scrub });
      gsap.to(yantra, { rotation: 360, duration: 300, ease: "none", repeat: -1 });

      // Light circling the yantra's outer ring, sparks where it passes.
      const highlight = yantra.querySelector('[data-highlight="0"]');
      const core = highlight.querySelector("[data-highlight-core]");
      const svg = yantra.querySelector("svg");
      gsap.set(highlight.children, { opacity: 1 });
      gsap.fromTo(highlight.children, { strokeDashoffset: 0 }, { strokeDashoffset: -1, duration: LIGHT_LOOP, ease: "none", repeat: -1 });
      const sparkAt = (fraction) => {
        if (gsap.getProperty(yantra, "autoAlpha") < 0.6) return; // not on screen yet
        const len = core.getTotalLength();
        const pt = core.getPointAtLength(len * fraction);
        const p = new DOMPoint(pt.x, pt.y).matrixTransform(svg.getScreenCTM());
        const box = root.getBoundingClientRect();
        const x = (p.x - box.left) / box.width;
        const y = (p.y - box.top) / box.height;
        if (x < 0.02 || x > 0.98 || y < 0.05 || y > 0.98) return; // off-screen part of the ring
        const id = ++burstId.current;
        setBursts((b) => [...b, { id, x, y }]);
      };
      // Three sparks per lap, at points along the visible arc. A repeating
      // timeline (tracked by the context, so the cleanup stops it).
      const sparks = gsap.timeline({ repeat: -1 }).to({}, { duration: LIGHT_LOOP }, 0);
      [0.15, 0.42, 0.7].forEach((frac) => sparks.call(() => sparkAt(frac + 0.045), null, LIGHT_LOOP * frac));
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {play && (
        <LightSweep
          trigger="loop"
          duration={2.4}
          interval={6}
          intensity={0.6}
          blend="soft-light"
          style={{ position: "absolute", inset: 0 }}
        />
      )}

      <div
        ref={yantraRef}
        className="invisible absolute bottom-0 left-0 -translate-x-[46%] translate-y-[46%]"
        style={{ width: "clamp(380px, 58vw, 860px)", height: "clamp(380px, 58vw, 860px)" }}
      >
        <YantraMandala size="100%" opacity={0.55} highlights hollow={false} />
      </div>

      <div ref={edgeRef} className="invisible absolute right-2 top-[16vh] h-[52vh] w-5 sm:right-5 sm:w-7">
        <EdgeFiligree />
      </div>

      {bursts.map((b) => (
        <GoldParticles
          key={b.id}
          playKey={b.id}
          count={6}
          duration={1.5}
          origin={{ x: b.x, y: b.y }}
          spread={0.025}
          rise={0.07}
          onComplete={() => setBursts((list) => list.filter((x) => x.id !== b.id))}
        />
      ))}
    </div>
  );
}
