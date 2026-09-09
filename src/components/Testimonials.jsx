"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "The machine is very good, and the company's service is excellent. The staff who delivered and supported us were also very professional and helpful.",
    name: "Milkobites Icecream",
  },
  {
    quote:
      "I am really happy with my ice cream machine from DOSTAN Machines. Even after the purchase, their team continues to support us and help resolve any issues. Everyone is very cooperative, especially Deepak Sir and Kapil Sir.",
    name: "Debashis Mallik",
  },
  {
    quote:
      "I am from Ayodhya, Uttar Pradesh, and purchased a 300L ice cream plant from DOSTAN Machines. All the machines are working very well, and the DOSTAN team has been extremely supportive throughout.",
    name: "Anupam Yadav",
  },
  {
    quote:
      "Very good machines and very helpful people. The team is supportive and always willing to help in different ways. I came to know about DOSTAN through YouTube.",
    name: "Md Azad",
  },
  {
    quote:
      "DOSTAN Machines se judkar bahut achha laga. Bahut achhi company hai. Maine batch freezer liya tha, jo bahut achha chal raha hai.",
    name: "Arvind Singh",
  },
  {
    quote:
      "We have had a very positive experience working with DOSTAN Machines. Their team is professional, responsive, and committed to delivering quality products and excellent service.",
    name: "Mansi Singh",
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

        <div className="relative min-h-[20rem] flex-1 sm:min-h-[16rem] md:min-h-[13rem] lg:min-h-[9rem] xl:min-h-[7rem]">
          <p className="text-lg leading-relaxed">&quot;{current.quote}&quot;</p>

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold">{current.name}</p>
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
