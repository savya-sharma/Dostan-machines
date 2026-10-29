"use client";

import { useState } from "react";
import Image from "next/image";
import RangoliMotif from "./RangoliMotif";
import DiyaAccent from "./DiyaAccent";
import GoldParticles from "./GoldParticles";
import LightSweep from "./LightSweep";
import FestiveDivider from "./FestiveDivider";

// Development-only gallery (rendered by /festival-preview). Shows each
// Diwali element on the site's real backgrounds plus where it will be used,
// so the artwork can be reviewed before any page integration.

const MACHINE = "/images/machines/GALLERY-01.webp";

const USAGE = [
  {
    asset: "Precision rangoli",
    where: [
      "Loader — behind the logo, lines draw in at low opacity",
      "Why Dostan Machines section — large, slow-turning, very faint, off to one side",
      "Quote page — small, beside the heading",
    ],
  },
  {
    asset: "Diya accent",
    where: [
      "Loader — small, under the wordmark",
      "Closing call-to-action — beside “Ready to discuss your requirements?”",
      "Footer — beside the copyright line",
    ],
  },
  {
    asset: "Gold particles",
    where: [
      "Loader — a short burst as the counter reaches 100%",
      "Final reveal — one burst as the loader curtain lifts off the hero",
    ],
  },
  {
    asset: "Light sweep",
    where: [
      "Product Categories and Machinery cards — a pass on hover",
      "Machine detail page — a single pass over the main photo on arrival",
    ],
  },
  {
    asset: "Festive dividers",
    where: [
      "Home — between Product Categories and End-to-End Solutions (lotus)",
      "Home — above the FAQ (facet)",
      "Footer — top edge (lotus)",
    ],
  },
];

function Panel({ title, note, children, dark = false }) {
  return (
    <section
      className={`rounded-[1.25rem] p-8 sm:p-10 ${
        dark ? "bg-ink text-surface" : "bg-white text-ink shadow-[0_1px_2px_rgba(17,19,21,0.04)]"
      }`}
    >
      <h2 className="text-lg font-medium tracking-tight">{title}</h2>
      {note && <p className={`mt-1 text-sm ${dark ? "text-surface/50" : "text-ink/50"}`}>{note}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const button =
  "rounded-[0.7rem] border border-current/20 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors hover:border-current";

export default function DiwaliShowcase() {
  const [drawKey, setDrawKey] = useState(0);
  const [burst, setBurst] = useState(0);
  const [onceKey, setOnceKey] = useState(0);

  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">Development preview</p>
      <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">Diwali artwork</h1>
      <p className="mt-4 max-w-2xl text-sm text-ink/60">
        Original assets for the date-driven Diwali theme. Nothing here is on the live pages yet — each
        piece will be placed inside <code>&lt;DiwaliOnly&gt;</code>, so the default site stays untouched
        outside the festival dates.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Panel title="1. Precision rangoli" note="Size, stroke weight, opacity and animation are props." dark>
          <div className="flex flex-wrap items-end gap-10">
            <RangoliMotif key={drawKey} size={220} animate="draw" />
            <RangoliMotif size={120} strokeOpacity={0.5} animate="spin" spinDuration={40} />
            <RangoliMotif size={64} strokeOpacity={0.9} />
          </div>
          <button type="button" className={`${button} mt-8`} onClick={() => setDrawKey((k) => k + 1)}>
            Replay draw-in
          </button>
        </Panel>

        <Panel title="1. Precision rangoli — on off-white" note="Same asset, low opacity as a background mark.">
          <div className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-[0.7rem] bg-surface">
            <RangoliMotif size={420} strokeOpacity={0.35} animate="spin" className="absolute -right-24" />
            <p className="relative max-w-xs text-2xl leading-tight">Engineered for every celebration.</p>
          </div>
        </Panel>

        <Panel title="2. Diya accent" note="Minor accent: 16–48px beside a heading or CTA." dark>
          <div className="flex flex-wrap items-end gap-10">
            <DiyaAccent size={96} title="Diya" />
            <DiyaAccent size={48} />
            <DiyaAccent size={24} />
            <p className="flex items-center gap-3 text-lg">
              <DiyaAccent size={28} /> Happy Diwali from Dostan Machines
            </p>
          </div>
        </Panel>

        <Panel title="3. Golden light particles" note="Finite burst, then the canvas clears and stops." dark>
          <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[0.7rem] border border-surface/10">
            <p className="font-mono text-5xl font-light text-surface">100<span className="text-accent">%</span></p>
            {burst > 0 && <GoldParticles playKey={burst} />}
          </div>
          <button type="button" className={`${button} mt-6`} onClick={() => setBurst((n) => n + 1)}>
            Play burst
          </button>
        </Panel>

        <Panel title="4. Industrial light sweep" note="Masked to the machine’s silhouette; the photo itself is never altered. Hover the left image.">
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Hover", "hover", undefined],
              ["Single pass", "once", onceKey],
            ].map(([label, trigger, key]) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="aspect-square rounded-[0.7rem] bg-[radial-gradient(ellipse_at_center,#ffffff_35%,#ecece9_100%)] p-6">
                  <LightSweep key={key} trigger={trigger} maskSrc={MACHINE} className="h-full w-full" tabIndex={0}>
                    <Image src={MACHINE} alt="Ageing Tank" fill sizes="300px" className="object-contain" />
                  </LightSweep>
                </div>
                <span className="text-xs text-ink/50">{label}</span>
              </div>
            ))}
          </div>
          <button type="button" className={`${button} mt-6`} onClick={() => setOnceKey((k) => k + 1)}>
            Replay single pass
          </button>
        </Panel>

        <Panel title="5. Festive dividers" note="The motif keeps its size; the hairlines take the width.">
          <div className="flex flex-col gap-10">
            <FestiveDivider variant="lotus" />
            <FestiveDivider variant="facet" />
            <div className="rounded-[0.7rem] bg-ink p-6">
              <FestiveDivider variant="lotus" opacity={0.6} />
            </div>
          </div>
        </Panel>
      </div>

      <section className="mt-16 border-t border-[#DDDDDD] pt-10">
        <h2 className="text-xl font-medium tracking-tight sm:text-2xl">Where each piece goes</h2>
        <p className="mt-2 text-sm text-ink/50">Planned placements for the next stages — not yet applied to any page.</p>
        <dl className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {USAGE.map(({ asset, where }) => (
            <div key={asset} className="border-t border-[#E6E6E3] pt-4">
              <dt className="text-sm font-medium">{asset}</dt>
              <dd>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/60">
                  {where.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
