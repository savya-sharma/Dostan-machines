"use client";

import { useId } from "react";
import { DIWALI } from "./palette";

// Sculptural diya: a deep, machined lamp bowl in brushed dark metal with a
// fine gold rim and oil line, and a small restrained flame at the spout.
// Reads on both the ink and off-white backgrounds. Meant as a minor accent
// (16–48px) beside a heading or CTA, never a centrepiece.

// Body metal per background: "dark" brushed steel for light backgrounds,
// "light" polished steel so the silhouette still reads on dark ones.
const TONES = {
  dark: { top: "#8a8c92", mid: DIWALI.metalMid, bottom: DIWALI.metalDark, foot: DIWALI.metalMid, facet: "#9a9ca2" },
  light: { top: "#e4e5e8", mid: "#a9acb2", bottom: "#62656b", foot: "#a9acb2", facet: "#45474d" },
};

/**
 * @param {object} props
 * @param {number|string} [props.size=32]      Rendered width (height follows the 64×56 aspect).
 * @param {"dark"|"light"} [props.tone="dark"] Body metal; use "light" on dark backgrounds.
 * @param {boolean} [props.flicker=true]       Subtle flame breathing; off for prefers-reduced-motion.
 * @param {string} [props.title]               Accessible name; omit for decoration.
 */
export default function DiyaAccent({ size = 32, tone = "dark", flicker = true, title, className = "", style }) {
  const id = useId().replace(/:/g, "");
  const body = `diya-body-${id}`;
  const flame = `diya-flame-${id}`;
  const metal = TONES[tone] ?? TONES.dark;

  return (
    <svg
      viewBox="0 0 64 56"
      width={size}
      height={typeof size === "number" ? (size * 56) / 64 : undefined}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
      style={style}
    >
      <defs>
        {/* Brushed steel: light at the lip, falling to near-black below. */}
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={metal.top} />
          <stop offset="0.35" stopColor={metal.mid} />
          <stop offset="1" stopColor={metal.bottom} />
        </linearGradient>
        <linearGradient id={flame} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={DIWALI.amber} />
          <stop offset="1" stopColor={DIWALI.goldLight} />
        </linearGradient>
      </defs>

      {/* Foot */}
      <path d="M24 46.5h15l-2.2 5.5H26.2z" fill={metal.foot} />
      {/* Bowl with the pinched spout on the right */}
      <path
        d="M5 30h43.5l9.4-4.2c1.4-.6 2.4 1 1.2 2L53.4 32C50 41.8 41.6 47 30.6 47 17.8 47 8.4 40.6 5 30z"
        fill={`url(#${body})`}
      />
      {/* Fine gold rim: the only metallic highlight */}
      <path
        d="M5.4 30h43.1l9.4-4.2"
        fill="none"
        stroke={DIWALI.gold}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Oil surface, seen just inside the rim */}
      <path d="M10 31.6c10.4 2.8 25 2.8 37 0" fill="none" stroke={DIWALI.gold} strokeWidth="0.8" strokeLinecap="round" opacity="0.45" vectorEffect="non-scaling-stroke" />
      {/* One machined facet line across the bowl */}
      <path d="M11.6 37.6c5.6 3.9 12.2 5.6 19.4 5.6" fill="none" stroke={metal.facet} strokeWidth="0.8" strokeLinecap="round" opacity="0.35" vectorEffect="non-scaling-stroke" />

      {/* Flame at the spout */}
      <g className={flicker ? "diwali-flicker" : undefined} style={{ transformOrigin: "57.4px 25px" }}>
        <path d="M57.4 6.5c3 5.4 4.7 9.4 4.7 12.4a4.7 4.7 0 0 1-9.4 0c0-3 1.7-7 4.7-12.4z" fill={`url(#${flame})`} />
        <path d="M57.4 14.2c1.1 2 1.8 3.5 1.8 4.7a1.8 1.8 0 0 1-3.6 0c0-1.2.7-2.7 1.8-4.7z" fill="#fff6dc" opacity="0.9" />
      </g>
    </svg>
  );
}
