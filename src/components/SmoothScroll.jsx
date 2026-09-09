"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis smooth scroll — lerp controls how quickly scroll catches up to
    // the target position each frame (0-1). Lower = smoother/slower drift,
    // higher = snappier/closer to native. Tweak the value below.
    const lenis = new Lenis({
      lerp: 0.03,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
