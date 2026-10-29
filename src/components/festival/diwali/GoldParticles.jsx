"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DIWALI } from "./palette";

const COLORS = [DIWALI.goldLight, DIWALI.gold, DIWALI.amber];

// A finite burst of small gold/amber motes that rise, drift and fade out,
// then stop for good. Fills its positioned parent (absolute inset-0) with
// one small canvas, ignores pointer events, and is hidden from assistive
// tech. Runs on the shared GSAP ticker the site already uses, and draws
// soft glows as a second faint circle rather than canvas shadow/blur.
//
// Nothing renders for prefers-reduced-motion; onComplete still fires.

/**
 * @param {object} props
 * @param {number} [props.count=22]          Particles in the burst (keep it small).
 * @param {number} [props.duration=1.8]      Seconds until the last particle is gone.
 * @param {{x:number,y:number}} [props.origin={x:0.5,y:0.6}]  Emitter, as fractions of the box.
 * @param {number} [props.spread=0.35]       Horizontal emitter width, as a fraction of the box.
 * @param {number} [props.rise=0.35]         How far particles travel up, as a fraction of the box height.
 * @param {number} [props.opacity=0.85]      Peak particle opacity.
 * @param {*}      [props.playKey]            Change this to replay the burst.
 * @param {() => void} [props.onComplete]
 */
export default function GoldParticles({
  count = 22,
  duration = 1.8,
  origin = { x: 0.5, y: 0.6 },
  spread = 0.35,
  rise = 0.35,
  opacity = 0.85,
  playKey,
  onComplete,
  className = "",
}) {
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onCompleteRef.current?.();
      return;
    }

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.scale(dpr, dpr);

    const particles = Array.from({ length: count }, () => {
      const life = duration * (0.55 + Math.random() * 0.45);
      return {
        x: width * (origin.x + (Math.random() - 0.5) * spread),
        y: height * (origin.y + (Math.random() - 0.5) * 0.08),
        dx: (Math.random() - 0.5) * width * 0.08,
        dy: -height * rise * (0.5 + Math.random() * 0.5),
        r: 0.7 + Math.random() * 1.3,
        delay: Math.random() * (duration - life),
        life,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        sway: Math.random() * Math.PI * 2,
      };
    });

    let start = null;
    let finished = false;
    function tick(time) {
      if (start === null) start = time;
      const t = time - start;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const k = (t - p.delay) / p.life;
        if (k <= 0 || k >= 1) continue;
        const ease = 1 - (1 - k) * (1 - k);
        const x = p.x + p.dx * ease + Math.sin(p.sway + k * 5) * 3;
        const y = p.y + p.dy * ease;
        // Fade in fast, out slow.
        const alpha = opacity * Math.min(1, k * 6) * (1 - k) ** 1.4;
        ctx.globalAlpha = alpha * 0.18;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (t >= duration && !finished) {
        finished = true;
        ctx.clearRect(0, 0, width, height);
        gsap.ticker.remove(tick);
        onCompleteRef.current?.();
      }
    }

    // gsap.ticker passes elapsed seconds.
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ctx.clearRect(0, 0, width, height);
    };
    // Re-run only for a deliberate replay; the config props are read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
