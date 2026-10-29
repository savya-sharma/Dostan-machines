"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import YantraMandala from "./YantraMandala";
import CornerFiligree from "./CornerFiligree";
import GoldParticles from "./GoldParticles";
import { createDiwaliAtmosphere } from "./diwaliAtmosphere";

// The Diwali first-load sequence. HeroLoader owns readiness (the real frame
// loading progress) and passes in its wordmark, progress line and counter;
// this scene owns the choreography:
//
//   A  atmosphere — the dark background warms with drifting amber light
//      and grain (WebGL shader; plain CSS background if unavailable)
//   B  drawing    — filigree draws in from three corners while the large
//      yantra-mandala draws layer by layer around the logo
//   C  light      — warm light travels three paths of the artwork; the
//      shader glow follows it and a few sparks rise where it passes
//   D  hold       — if loading isn't done yet, the finished composition
//      breathes: slow rotation, warm pulse, the light keeps circling
//   E  reveal     — exit(): the light gathers at the centre, a short sparkle
//      burst, then the shader dissolves outward from the centre on a
//      noise-shaped, amber-rimmed edge (CSS iris if WebGL is unavailable)
//
// exit() never waits on decoration: an unfinished entrance jumps to its end.

const MANDALA_SIZE = "min(max(76vmin, min(88vw, 420px)), 760px)";
const CORNER_SIZE = "clamp(110px, 20vmin, 220px)";
const INK_BACKGROUND =
  "radial-gradient(ellipse at center, rgba(245,245,243,0.05) 0%, transparent 65%), #111315";
// CSS fallback reveal (no WebGL): feathered iris, radius in vmax.
const IRIS_FEATHER = 14;
const IRIS_MASK = `radial-gradient(circle at 50% 50%, transparent calc(var(--reveal) * 1vmax), #000 calc((var(--reveal) + ${IRIS_FEATHER}) * 1vmax))`;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function DiwaliLoaderScene({ ref, wordmark, progressLine, counter }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const mandalaRef = useRef(null);
  const logoRef = useRef(null);
  const atmosphereRef = useRef(null);
  const introRef = useRef(null);
  const holdRef = useRef([]);
  const ctxRef = useRef(null);
  const burstId = useRef(0);
  // Spark bursts currently playing: { id, x, y, count, spread, rise, duration }
  // with x/y as fractions of the viewport.
  const [bursts, setBursts] = useState([]);

  const spark = (x, y, opts = {}) => {
    const id = ++burstId.current;
    setBursts((b) => [
      ...b,
      { id, x: x / window.innerWidth, y: y / window.innerHeight, count: 7, spread: 0.03, rise: 0.08, duration: 1.4, ...opts },
    ]);
  };
  const removeBurst = (id) => setBursts((b) => b.filter((x) => x.id !== id));

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const reduced = prefersReducedMotion();
    const atmosphere = createDiwaliAtmosphere(canvas);
    atmosphereRef.current = atmosphere;

    // Without WebGL: the plain loader background, and the CSS iris reveal.
    if (!atmosphere) {
      root.style.background = INK_BACKGROUND;
      root.style.setProperty("--reveal", -IRIS_FEATHER);
      root.style.webkitMaskImage = IRIS_MASK;
      root.style.maskImage = IRIS_MASK;
    }

    const render = (time) => atmosphere?.render(time);
    // Reduced motion: a single still frame (no drifting light or grain).
    const onResize = () => {
      atmosphere?.resize();
      if (reduced) atmosphere?.render(0);
    };
    if (atmosphere) {
      atmosphere.state.lightX = window.innerWidth / 2;
      atmosphere.state.lightY = window.innerHeight / 2;
      if (!reduced) gsap.ticker.add(render);
      window.addEventListener("resize", onResize);
    }

    const ctx = gsap.context(() => {
      const q = (sel) => [...root.querySelectorAll(sel)];
      const group = (name) => q(`[data-group="${name}"]`);
      const letters = q("[data-letter]");
      const wordmarkEl = root.querySelector("[data-wordmark]");
      const bar = root.querySelector("[data-progress-line]");
      const counterEl = root.querySelector("[data-counter]");
      const highlights = q("[data-highlight]");
      const svg = mandalaRef.current.querySelector("svg");

      // Screen position of the head of a travelling highlight.
      const headOf = (index, t) => {
        const path = highlights[index].querySelector("[data-highlight-core]");
        const len = path.getTotalLength();
        const point = path.getPointAtLength(len * (((t % 1) + 1) % 1));
        return new DOMPoint(point.x, point.y).matrixTransform(svg.getScreenCTM());
      };
      const followHead = (index, t) => {
        if (!atmosphere) return;
        const p = headOf(index, t);
        atmosphere.state.lightX = p.x;
        atmosphere.state.lightY = p.y;
      };

      if (reduced) {
        // Finished composition, no motion.
        gsap.set(q("[data-group]"), { strokeDashoffset: 0, opacity: 1 });
        gsap.set([logoRef.current, wordmarkEl, counterEl, bar], { autoAlpha: 1 });
        if (atmosphere) {
          atmosphere.state.warm = 1;
          atmosphere.render(0);
          root.style.background = "transparent";
        }
        return;
      }

      // The shader paints the background from here on.
      if (atmosphere) {
        atmosphere.render(0);
        root.style.background = "transparent";
      }

      const comet = { t: 0 };
      const drawLines = (els, at, duration, amount) =>
        tl.to(els, { strokeDashoffset: 0, duration, ease: "power2.inOut", stagger: { amount } }, at);

      const tl = gsap.timeline();
      introRef.current = tl;
      tl.set(wordmarkEl, { autoAlpha: 1 }).set(letters, { yPercent: 110 });
      // A — atmosphere warms.
      if (atmosphere) tl.to(atmosphere.state, { warm: 1, duration: 2.6, ease: "power1.out" }, 0);
      // B — corners draw in from the edges, then the mandala layer by layer.
      drawLines(group("corner"), 0.15, 1.5, 0.5);
      tl.to(group("corner-dot"), { opacity: 1, duration: 0.4, stagger: 0.05 }, 1.4);
      tl.fromTo(logoRef.current, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0.3);
      drawLines(group("gate"), 0.4, 1.4, 0.15);
      drawLines(group("rings"), 0.7, 1.2, 0.45);
      drawLines(group("ticks"), 0.95, 0.8, 0.6);
      drawLines(group("outer-lotus"), 1.1, 1.1, 0.8);
      drawLines(group("flourish"), 1.5, 1.0, 0.6);
      drawLines(group("inner-lotus"), 1.8, 0.9, 0.5);
      tl.to(group("dots"), { opacity: 1, duration: 0.5, stagger: { amount: 0.6 } }, 2.1);
      tl.fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.025 }, 1.2);
      tl.fromTo(bar, { autoAlpha: 1, scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.out" }, 1.5);
      tl.fromTo(counterEl, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.5);

      // C — light travels the outer ring, the gate and the lotus.
      tl.to(highlights.flatMap((h) => [...h.children]), { opacity: 1, duration: 0.4, stagger: 0.15 }, 2.6);
      highlights.forEach((h, i) => {
        tl.fromTo(h.children, { strokeDashoffset: 0 }, { strokeDashoffset: -1, duration: 2.4, ease: "power1.inOut" }, 2.6 + i * 0.3);
      });
      if (atmosphere) tl.to(atmosphere.state, { lightI: 1, duration: 0.6 }, 2.6);
      tl.to(comet, { t: 1, duration: 2.4, ease: "power1.inOut", onUpdate: () => followHead(0, comet.t + 0.045) }, 2.6);
      [3.2, 3.9, 4.5].forEach((at, i) =>
        tl.call(() => {
          const p = headOf(i === 1 ? 1 : 0, i === 1 ? 0.5 : comet.t + 0.045);
          spark(p.x, p.y);
        }, null, at)
      );
      tl.to(highlights.slice(1).flatMap((h) => [...h.children]), { opacity: 0, duration: 0.6 }, 5.2);

      // D — hold, if loading is still going.
      // These run until exit() stops them (or the cleanup reverts them).
      tl.add(() =>
        ctx.add(() => {
          const loop = { t: 0 };
          holdRef.current = [
            gsap.to(mandalaRef.current, { rotation: "+=360", duration: 240, ease: "none", repeat: -1 }),
            atmosphere && gsap.to(atmosphere.state, { warm: 0.82, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 }),
            gsap.fromTo(highlights[0].children, { strokeDashoffset: 0 }, { strokeDashoffset: -1, duration: 6, ease: "none", repeat: -1 }),
            gsap.to(loop, {
              t: 1,
              duration: 6,
              ease: "none",
              repeat: -1,
              onUpdate: () => followHead(0, loop.t + 0.045),
              onRepeat: () => {
                const p = headOf(0, 0.045);
                spark(p.x, p.y, { count: 5 });
              },
            }),
            atmosphere && gsap.to(atmosphere.state, { lightI: 0.7, duration: 1 }),
          ].filter(Boolean);
        })
      );
    }, root);
    ctxRef.current = ctx;

    return () => {
      introRef.current = null;
      ctx.revert();
      ctxRef.current = null;
      if (atmosphere) {
        gsap.ticker.remove(render);
        window.removeEventListener("resize", onResize);
        atmosphere.destroy();
      }
      atmosphereRef.current = null;
    };
  }, []);

  // E — the reveal timeline (see exit() below).
  function buildExit({ root, atmosphere, content, cx, cy, onDone }) {
    const tl = gsap.timeline({ onComplete: () => onDone?.() });
    tl.to(root.querySelectorAll("[data-highlight] > *"), { opacity: 0, duration: 0.3 }, 0);
    // Light gathers at the centre…
    if (atmosphere) tl.to(atmosphere.state, { lightX: cx, lightY: cy, lightI: 1.6, duration: 0.55, ease: "power2.inOut" }, 0);
    tl.to(mandalaRef.current, { scale: 1.04, duration: 0.8, ease: "power2.out" }, 0);
    // …a short sparkle burst…
    tl.call(() => spark(cx, cy, { count: 24, spread: 0.12, rise: 0.2, duration: 1.3 }), null, 0.4);
    tl.to(content, { autoAlpha: 0, duration: 0.45, ease: "power2.in", stagger: 0.04 }, 0.35);
    tl.to(root.querySelectorAll("[data-corner]"), { autoAlpha: 0, duration: 0.5 }, 0.45);
    // …then the organic dissolve uncovers the site.
    if (atmosphere) {
      tl.to(atmosphere.state, { lightI: 0, duration: 0.6 }, 0.6);
      tl.to(atmosphere.state, { reveal: 1.75, duration: 1.3, ease: "power2.inOut" }, 0.5);
    } else {
      const iris = { r: -IRIS_FEATHER };
      tl.to(iris, { r: 120, duration: 1.25, ease: "power2.inOut", onUpdate: () => root.style.setProperty("--reveal", iris.r) }, 0.5);
    }
    return tl;
  }

  useImperativeHandle(ref, () => ({
    // E — the reveal. Calls onDone once the website is fully uncovered.
    exit(onDone) {
      const root = rootRef.current;
      const atmosphere = atmosphereRef.current;
      introRef.current?.progress(1);
      holdRef.current.forEach((tween) => tween.kill());
      holdRef.current = [];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const content = [mandalaRef.current, logoRef.current, root.querySelector("[data-brand-text]"), root.querySelector("[data-counter]")];

      // Built inside the scene's context, so unmounting mid-reveal reverts it.
      const run = () => buildExit({ root, atmosphere, content, cx, cy, onDone });
      if (ctxRef.current) ctxRef.current.add(run);
      else run();
    },
  }));


  return (
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 z-[70] overflow-hidden" style={{ background: INK_BACKGROUND }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Phase B corners: three, leaving the bottom-right to the counter. */}
      {[
        ["top-left", "left-3 top-3"],
        ["top-right", "right-3 top-3"],
        ["bottom-left", "bottom-3 left-3"],
      ].map(([corner, pos]) => (
        <div key={corner} data-corner className={`pointer-events-none absolute ${pos}`}>
          <CornerFiligree corner={corner} size={CORNER_SIZE} mode="draw" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative" style={{ width: MANDALA_SIZE, height: MANDALA_SIZE }}>
          <div ref={mandalaRef} className="absolute inset-0">
            <YantraMandala size="100%" mode="draw" highlights opacity={0.95} />
          </div>
          <Image
            ref={logoRef}
            src="/logos/logo-01.svg"
            alt=""
            width={80}
            height={77}
            priority
            className="invisible absolute left-1/2 top-1/2 h-[11%] w-auto -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div data-brand-text className="flex flex-col items-center">
          {wordmark}
          {progressLine}
        </div>
      </div>

      {bursts.map((b) => (
        <GoldParticles
          key={b.id}
          playKey={b.id}
          count={b.count}
          duration={b.duration}
          origin={{ x: b.x, y: b.y }}
          spread={b.spread}
          rise={b.rise}
          onComplete={() => removeBurst(b.id)}
        />
      ))}

      {counter}
    </div>
  );
}
