"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DiyaAccent from "./DiyaAccent";
import { DIWALI } from "./palette";

// Toran for the navbar: the festive garland hung over doorways at Diwali,
// redrawn as precise gold linework. It hangs from the navbar's lower edge
// across its full width — a rule with lotus finials, a run of scalloped
// arcs with hanging drops, and a small diya as the centre pendant — plus
// fine corner brackets framing the bar itself.
//
// The scallop count comes from the measured width, so the garland is
// recomposed (not squashed) on narrow screens. A warm metallic glint runs
// along it in step with the hero's frame sequence (scroll progress through
// the hero), so the bar and the machinery below move together; elsewhere it
// glints once on arrival. Pointer events pass straight through.

const HEIGHT = 30;
const SCALLOP = 44; // target scallop width (px)

function buildGarland(width) {
  const w = Math.max(120, width);
  const n = Math.max(4, Math.round((w - 40) / SCALLOP));
  const start = 20;
  const span = (w - 40) / n;
  const centre = w / 2;
  let scallops = "";
  const drops = [];
  for (let i = 0; i < n; i++) {
    const x0 = start + i * span;
    const x1 = x0 + span;
    scallops += `M${x0.toFixed(1)} 2Q${((x0 + x1) / 2).toFixed(1)} 13 ${x1.toFixed(1)} 2`;
    drops.push({ x: x1, long: i % 2 === 0 });
  }
  drops.pop(); // the last joint is the right finial
  // Keep the centre clear for the pendant.
  const clear = drops.filter((d) => Math.abs(d.x - centre) > span * 0.6);
  return {
    w,
    rule: `M14 2H${(w - 14).toFixed(1)}`,
    finials: `M14 2c-4-3.5-8-3.5-10 0c2 3.5 6 3.5 10 0zM${(w - 14).toFixed(1)} 2c4-3.5 8-3.5 10 0c-2 3.5-6 3.5-10 0z`,
    scallops,
    drops: clear
      .map(({ x, long }) => {
        const len = long ? 9 : 5;
        const y = 2 + len;
        return `M${x.toFixed(1)} 2V${y}M${x.toFixed(1)} ${y}l-2.2 3 2.2 3 2.2-3z`;
      })
      .join(""),
    centre,
  };
}

const bracket = (rot) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
    <path d="M1 12V1h11" fill="none" stroke={DIWALI.gold} strokeWidth="1" vectorEffect="non-scaling-stroke" />
    <path d="M1 1l3.2 3.2" fill="none" stroke={DIWALI.gold} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.7" />
  </svg>
);

export default function NavbarToran({ menuOpen = false }) {
  const rootRef = useRef(null);
  const gradientRef = useRef(null);
  const [garland, setGarland] = useState(null);
  const id = useId().replace(/:/g, "");

  // Measure the bar and recompose the garland for its width.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // ResizeObserver also reports the initial size as soon as it observes.
    const ro = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      setGarland((g) => (g && g.w === width ? g : buildGarland(width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Draw-in on arrival, then the glint.
  useEffect(() => {
    if (!garland) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const gradient = gradientRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setGlint = (x) => gradient?.setAttribute("gradientTransform", `translate(${x.toFixed(1)} 0)`);

    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll("[data-toran-line]");
      if (reduced) {
        setGlint(-200);
        return;
      }
      gsap.fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.12 });
      gsap.fromTo(root.querySelectorAll("[data-toran-fade]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 1.1, stagger: 0.1 });

      const glint = { x: -200 };
      const apply = () => setGlint(glint.x);
      apply();
      // One sweep on arrival…
      gsap.to(glint, { x: garland.w + 200, duration: 2.4, delay: 1.4, ease: "power2.inOut", onUpdate: apply });
      // …then, on the home page, the glint tracks the hero's frame sequence.
      const hero = document.querySelector("#home > div");
      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            gsap.to(glint, { x: -120 + self.progress * (garland.w + 240), duration: 0.6, ease: "power2.out", overwrite: true, onUpdate: apply });
          },
        });
      }
    }, root);
    return () => ctx.revert();
  }, [garland]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 transition-opacity duration-500"
      style={{ opacity: menuOpen ? 0 : 1 }}
    >
      {/* Corner brackets framing the bar */}
      <div className="absolute left-1.5 top-1.5">{bracket(0)}</div>
      <div className="absolute right-1.5 top-1.5">{bracket(90)}</div>
      <div className="absolute bottom-1.5 right-1.5">{bracket(180)}</div>
      <div className="absolute bottom-1.5 left-1.5">{bracket(270)}</div>

      {/* The garland, hanging from the lower edge */}
      {garland && (
        <svg
          viewBox={`0 0 ${garland.w} ${HEIGHT}`}
          width={garland.w}
          height={HEIGHT}
          className="absolute left-0 top-full overflow-visible"
          style={{ marginTop: -1 }}
        >
          <defs>
            <linearGradient id={`toran-glint-${id}`} ref={gradientRef} gradientUnits="userSpaceOnUse" x1="-70" y1="0" x2="70" y2="0">
              <stop offset="0" stopColor="#fff3d6" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff3d6" stopOpacity="1" />
              <stop offset="1" stopColor="#fff3d6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g fill="none" stroke={DIWALI.gold} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
            <path d={garland.rule} strokeWidth="1" pathLength="1" strokeDasharray="1" data-toran-line="" />
            <path d={garland.scallops} strokeWidth="1" pathLength="1" strokeDasharray="1" data-toran-line="" />
            <path d={garland.finials} strokeWidth="0.9" data-toran-fade="" />
            <path d={garland.drops} strokeWidth="0.9" data-toran-fade="" />
          </g>
          {/* Metallic glint riding the same lines */}
          <g fill="none" stroke={`url(#toran-glint-${id})`} strokeLinecap="round" strokeWidth="1.6">
            <path d={garland.rule} />
            <path d={garland.scallops} />
          </g>
        </svg>
      )}

      {/* Centre pendant, tucked into the garland's centre gap so it never
          reaches page content (pages start ~22px below the bar). */}
      <div data-toran-fade className="absolute left-1/2 top-full -translate-x-1/2" style={{ marginTop: 1 }}>
        <DiyaAccent size={20} tone="light" />
      </div>
    </div>
  );
}
