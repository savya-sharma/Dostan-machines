"use client";

import DiwaliOnly from "./DiwaliOnly";
import LightSweep from "./LightSweep";

// Hover reflection for a machine card's image box (place it as the last
// child of the card's positioned image container). Clipped to the
// machine's own silhouette via its alpha, so the photo is never covered or
// tinted — a warm band just glances across the metal on hover. Renders
// nothing outside Diwali.
export default function DiwaliCardSweep({ src }) {
  return (
    <DiwaliOnly>
      <LightSweep
        trigger="hover"
        duration={1.1}
        intensity={0.45}
        maskSrc={src}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      />
    </DiwaliOnly>
  );
}
