"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Dostan Machines redesigned our entire bottling line and cut changeover time in half. Their engineers stayed on-site until every operator was confident.",
    name: "Aravind Menon,",
    role: "Plant Manager @ Coastal Beverages",
    company: "Coastal Beverages",
  },
  {
    quote:
      "From the first site survey to final commissioning, communication was clear and the timeline never slipped. The press forming cell has run flawlessly for two years.",
    name: "Fatima Al-Rashid,",
    role: "Operations Director @ Gulf Metal Works",
    company: "Gulf Metal Works",
  },
  {
    quote:
      "We've bought machines from several vendors over the years. Dostan is the only one that still picks up the phone five years after installation.",
    name: "James Whitfield,",
    role: "Head of Manufacturing @ Whitfield Automotive",
    company: "Whitfield Automotive",
  },
  {
    quote:
      "The continuous freezer they installed increased our output capacity without sacrificing texture quality. Exactly the upgrade our plant needed.",
    name: "Priya Nair,",
    role: "Production Head @ Nair Dairy Foods",
    company: "Nair Dairy Foods",
  },
  {
    quote:
      "Reliable machines, honest lead times, and a team that actually understands food-grade manufacturing. That combination is harder to find than it should be.",
    name: "Daniel Osei,",
    role: "Founder @ Osei Processing Co.",
    company: "Osei Processing Co.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const goNext = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length);

  const current = TESTIMONIALS[index];

  return (
    <div id="testimonials" className="px-[2rem] py-[6rem]">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="aspect-square w-full shrink-0 bg-gradient-to-br from-orange-300 via-pink-300 to-pink-400 p-6 sm:w-48">
          <div className="h-full w-full border-4 border-white bg-white"></div>
        </div>

        <div className="relative min-h-[20rem] flex-1 sm:min-h-[16rem] md:min-h-[11rem] lg:min-h-[8rem] xl:min-h-[7rem]">
          <p className="text-lg leading-relaxed">&quot;{current.quote}&quot;</p>

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm opacity-70">
                {current.name}
                <br />
                {current.role}
              </p>
              <p className="mt-1 font-semibold">{current.company}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center border border-line/30 transition-colors hover:border-accent hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center border border-line/30 transition-colors hover:border-accent hover:text-accent"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        {TESTIMONIALS.map((_, i) => (
          <div
            key={i}
            className={`h-[2px] flex-1 transition-colors ${
              i === index ? "bg-accent" : "bg-line/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
