"use client";

import { useEffect, useRef, useState } from "react";

// Warm golden reflection travelling across a metallic surface. An overlay
// band (screen-blended, low opacity) slides over the children — the image
// underneath is never modified, and outside the moving band the overlay is
// fully transparent, so nothing is left tinted.
//
// For transparent machine cut-outs pass `maskSrc` (the same image): the
// band is then clipped to the machine's own silhouette via its alpha, so
// the gold only ever lands on metal, never on the background.
//
// prefers-reduced-motion: no sweep at all.

/**
 * @param {object} props
 * @param {"hover"|"once"|"loop"} [props.trigger="hover"]
 *   hover: sweeps each time the pointer enters (or the element is focused);
 *   once: a single pass when mounted; loop: repeats with a pause.
 * @param {number} [props.duration=1.1]       Seconds per pass.
 * @param {number} [props.interval=6]         Seconds between passes for "loop".
 * @param {number} [props.intensity=0.55]     Peak band opacity.
 * @param {number} [props.angle=105]          Band direction in degrees.
 * @param {string} [props.maskSrc]            Image URL whose alpha clips the band.
 * @param {string} [props.maskSize="contain"] Must match how the image is fitted (object-contain → "contain").
 * @param {string} [props.maskPosition="center"]
 * @param {string} [props.blend="screen"]     Blend mode of the band. "soft-light" warms bright metal while leaving dark areas dark.
 * @param {string} [props.as="div"]
 */
export default function LightSweep({
  children,
  trigger = "hover",
  duration = 1.1,
  interval = 6,
  intensity = 0.55,
  angle = 105,
  maskSrc,
  maskSize = "contain",
  maskPosition = "center",
  blend = "screen",
  as: Tag = "div",
  className = "",
  ...rest
}) {
  const [pass, setPass] = useState(trigger === "once" || trigger === "loop" ? 1 : 0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (trigger !== "loop" || reducedRef.current) return;
    const id = setInterval(() => setPass((n) => n + 1), (duration + interval) * 1000);
    return () => clearInterval(id);
  }, [trigger, duration, interval]);

  const replay = () => {
    if (trigger === "hover" && !reducedRef.current) setPass((n) => n + 1);
  };

  const mask = maskSrc
    ? {
        WebkitMaskImage: `url("${maskSrc}")`,
        maskImage: `url("${maskSrc}")`,
        WebkitMaskSize: maskSize,
        maskSize,
        WebkitMaskPosition: maskPosition,
        maskPosition,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }
    : null;

  return (
    <Tag
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={replay}
      onFocus={replay}
      {...rest}
    >
      {children}
      {pass > 0 && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={mask ?? undefined}>
          <span
            // Remounting per pass restarts the CSS animation cleanly.
            key={pass}
            className="diwali-sweep absolute inset-y-0 -left-full w-[300%]"
            style={{
              "--diwali-sweep-duration": `${duration}s`,
              mixBlendMode: blend,
              // A narrow band (~7% of the 300%-wide track) reads as a fine
              // reflection rather than a wash of colour.
              background: `linear-gradient(${angle}deg, transparent 46%, rgba(246, 196, 104, ${intensity}) 50%, transparent 54%)`,
            }}
          />
        </span>
      )}
    </Tag>
  );
}
