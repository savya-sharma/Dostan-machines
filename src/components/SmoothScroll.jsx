"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const HOME_SCROLL_KEY = "dostan:home-scroll-y";

function readSavedHomeScroll() {
  try {
    const raw = window.sessionStorage.getItem(HOME_SCROLL_KEY);
    const y = raw === null ? NaN : Number(raw);
    return Number.isFinite(y) && y > 0 ? y : null;
  } catch {
    return null;
  }
}

export default function SmoothScroll() {
  const pathname = usePathname();
  // Set by a browser Back/Forward (popstate) so the next route change can
  // tell "returning to a page" apart from a fresh navigation (navbar/logo
  // link), which should still open at the top.
  const isHistoryNavRef = useRef(false);

  // Remembers where on Home the visitor was when they clicked through to
  // another page (e.g. a Product Categories "View" card), captured at click
  // time — by the time the route actually changes, the browser has already
  // clamped/reset the scroll position, so it can't be read afterwards.
  useEffect(() => {
    function onClick(e) {
      if (window.location.pathname !== "/") return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!link || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      // Same-page / hash links stay on Home, so there's nothing to return to.
      if (url.origin !== window.location.origin || url.pathname === "/") return;
      try {
        window.sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(window.scrollY)));
      } catch {
        // storage unavailable (private mode etc.) — falls back to top
      }
    }
    function onPopState() {
      isHistoryNavRef.current = true;
    }
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // Re-runs on every client-side route change (the `pathname` dependency
  // below). Lenis lives in the root layout, which never unmounts, so
  // without this it kept driving the window toward whatever scroll
  // position it was animating to on the *previous* page — fighting
  // Next.js's scroll-to-top reset and leaving the new page stuck a few
  // percent in. Tearing down and rebuilding Lenis (and refreshing
  // ScrollTrigger) here syncs both to whatever page is actually mounted.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // When a client-side navigation swaps in a shorter page, the browser
    // clamps the still-native scroll position to that page's new (smaller)
    // max scroll instead of resetting it — landing on, say, a product page
    // already scrolled to its footer. Snap back to the top ourselves before
    // Lenis reads the current position, unless the URL is pointing at a
    // hash (handled below), so a fresh Lenis never adopts a stale scroll.
    //
    // The one exception: a browser Back/Forward landing on Home restores
    // the position saved when the visitor left it, instead of the top.
    const restoreY =
      isHistoryNavRef.current && pathname === "/" && !window.location.hash
        ? readSavedHomeScroll()
        : null;
    isHistoryNavRef.current = false;

    if (!window.location.hash) {
      window.scrollTo({ top: restoreY ?? 0, left: 0, behavior: "instant" });
    }

    // Lenis smooth scroll — lerp controls how quickly scroll catches up to
    // the target position each frame (0-1). Lower = smoother/slower drift,
    // higher = snappier/closer to native. Tweak the value below.
    //
    // `content: document.body` overrides Lenis's default of
    // document.documentElement for its auto-resize ResizeObserver — the
    // root <html> element's box doesn't reliably fire ResizeObserver
    // callbacks when in-page content grows or shrinks (e.g. a form
    // revealing new fields after a choice is made), which left Lenis's
    // cached max-scroll stuck at the page's original height and made the
    // footer unreachable. document.body reports content-driven size
    // changes reliably.
    const lenis = new Lenis({
      lerp: 0.03,
      content: document.body,
    });

    // Exposed so anchor links (Navbar/Footer) can call lenis.scrollTo()
    // directly instead of relying on the browser's native hash jump, which
    // Lenis has no knowledge of and won't animate toward.
    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Recompute every ScrollTrigger's start/end positions against whatever
    // page is now mounted, once its layout has settled — stale positions
    // measured against the previous page's DOM are what leave scroll (and
    // any pinned/scrubbed animations) stuck partway down the new one.
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

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
        cancelAnimationFrame(refreshFrame);
        gsap.ticker.remove(update);
        window.lenis = null;
        lenis.destroy();
      };
    }

    // Belt-and-suspenders re-assertion: on a heavy previous page (e.g. the
    // homepage's pinned scroll animation still tearing down), the browser
    // can silently re-clamp scroll to the new page's footer area a tick
    // *after* the reset above already ran, landing on a short product page
    // already scrolled to the bottom. Re-forcing it once more, slightly
    // delayed, reliably wins that race without any visible extra scroll.
    const correctionTimer = setTimeout(() => {
      if (!window.location.hash) lenis.scrollTo(restoreY ?? 0, { immediate: true });
    }, 100);

    return () => {
      clearTimeout(correctionTimer);
      cancelAnimationFrame(refreshFrame);
      gsap.ticker.remove(update);
      window.lenis = null;
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
