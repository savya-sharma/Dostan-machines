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

    // Exposed so anchor links (Navbar/Footer) can call lenis.scrollTo()
    // directly instead of relying on the browser's native hash jump, which
    // Lenis has no knowledge of and won't animate toward.
    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Landed on this page with a hash already in the URL (e.g. navigated
    // from another page via "/#contact") — scroll to it smoothly once the
    // page has settled instead of leaving the browser's instant jump as-is.
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const scrollToTarget = () => {
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { offset: 0, immediate: false });
      };
      const t = setTimeout(scrollToTarget, 300);
      return () => {
        clearTimeout(t);
        gsap.ticker.remove(update);
        window.lenis = null;
        lenis.destroy();
      };
    }

    return () => {
      gsap.ticker.remove(update);
      window.lenis = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
