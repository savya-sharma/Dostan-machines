"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FestiveDivider from "./FestiveDivider";

// A festive divider for a section boundary (render inside <DiwaliOnly>).
// When it scrolls into view it draws itself once: the hairlines grow out
// from the motif and the motif's strokes trace in. It doesn't replay while
// scrolling back and forth; it plays again on the next visit to the page.
export default function DiwaliSectionDivider({ variant = "lotus", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const [left, , right] = root.firstElementChild.children;
      const strokes = root.querySelectorAll("svg path");
      const dots = root.querySelectorAll("svg circle");
      // The motif paths carry pathLength="1" in their markup.
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(dots, { opacity: 0 });
      gsap.set(left, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(right, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 85%", once: true } })
        .to(strokes, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.08 })
        .to(dots, { opacity: 1, duration: 0.3, stagger: 0.05 }, "-=0.3")
        .to([left, right], { scaleX: 1, duration: 1, ease: "expo.out" }, 0.2);
    }, root);

    // This divider appears after hydration (the festival is only known in
    // the browser), shifting what follows by its height — re-measure.
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`px-[2rem] ${className}`}>
      <FestiveDivider variant={variant} className="mx-auto max-w-3xl" />
    </div>
  );
}
