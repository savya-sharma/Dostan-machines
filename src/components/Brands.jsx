"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LOGOS = [
  { name: "Madhuvan Ice Cream", src: "/images/brands/brand_01.webp" },
  { name: "SnowFlakes Ice Cream", src: "/images/brands/brand_02.webp" },
  { name: "Fantasy Choice", src: "/images/brands/brand_03.webp" },
  { name: "MilkoBites Ice Cream", src: "/images/brands/brand_04.webp" },
  { name: "Creamora Ice Cream", src: "/images/brands/brand_05.webp" },
  { name: "Dhenuka Ice Cream", src: "/images/brands/brand_06.webp", scale: 1.25 },
  { name: "Freeze Brothers", src: "/images/brands/brand_07.webp" },
  { name: "Frost Magic Ice Cream", src: "/images/brands/brand_08.webp" },
  { name: "Guppeee", src: "/images/brands/brand_09.webp" },
  { name: "Heaven's Cold Ice Cream", src: "/images/brands/brand_10.webp" },
  { name: "Mewar Treats", src: "/images/brands/brand_11.webp" },
  { name: "Puresh Daily", src: "/images/brands/brand_12.webp" },
];

const FADE_MASK =
  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";

// Fewer, larger columns on small screens so logos read as a column
// layout on phones instead of a cramped 6-up grid.
function useColumns() {
  const [cols, setCols] = useState(6);

  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (mqLg.matches) setCols(6);
      else if (mqMd.matches) setCols(4);
      else if (mqSm.matches) setCols(3);
      else setCols(2);
    };

    update();
    mqSm.addEventListener("change", update);
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  return cols;
}

export default function Brands() {
  const cols = useColumns();
  const rows = Math.ceil(LOGOS.length / cols);
  const cells = [...LOGOS, ...Array(rows * cols - LOGOS.length).fill(null)];

  return (
    <div className="px-[2rem] py-[6rem]">
      <h1 className="mx-auto max-w-3xl text-center text-3xl leading-tight sm:text-4xl lg:text-5xl">
        Trusted By The Industry&apos;s Leading Brands.
      </h1>

      <div className="relative mt-[4rem]">
        {/* Faded grid lines — decorative layer, kept separate so the fade
            never touches the logo images themselves. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            maskImage: FADE_MASK,
            WebkitMaskImage: FADE_MASK,
          }}
        >
          {cells.map((_, index) => (
            <div key={index} className="border-t border-l border-line/40" />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: "var(--color-line)", opacity: 0.4, maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
        />

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((brand, index) =>
            brand ? (
              <div
                key={index}
                className="flex aspect-[3/2] items-center justify-center p-3 sm:p-6 lg:p-8"
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={180}
                  height={130}
                  className="h-auto w-full object-contain"
                  style={{ maxWidth: `${160 * (brand.scale ?? 1)}px` }}
                />
              </div>
            ) : (
              <div key={index} className="aspect-[3/2]" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
