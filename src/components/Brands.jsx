"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LOGOS = [
  { name: "Milk Bell Ice Cream", src: "/images/brands/brand-04.webp" },
  { name: "Madhuvana Ice Cream", src: "/images/brands/brand-01.webp" },
  { name: "Ice Empire", src: "/images/brands/brand-02.webp" },
  { name: "Fantasy Choice", src: "/images/brands/brand-03.webp" },
  { name: "Creamora Ice Cream", src: "/images/brands/brand-05.webp" },
  { name: "Dhenuka Ice Cream", src: "/images/brands/brand-06.webp" },
  { name: "Freeze Brothers", src: "/images/brands/brand-07.webp" },
  { name: "Frost Magic Ice Cream", src: "/images/brands/brand-08.webp" },
  { name: "Guppeee", src: "/images/brands/brand-09.webp" },
  { name: "Heaven's Cold Ice Cream", src: "/images/brands/brand-10.webp" },
  { name: "Madhuvan Ice Cream", src: "/images/brands/brand-11.webp" },
  { name: "Mewar Treats", src: "/images/brands/brand-12.webp" },
  { name: "Puresh Daily", src: "/images/brands/brand-13.webp" },
  { name: "SnowFlakes Ice Cream", src: "/images/brands/brand-14.webp" },
  { name: "MilkoBites Ice Cream", src: "/images/brands/brand-15-milkobites.webp" },
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
                  className="h-auto w-full max-w-[160px] object-contain"
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
