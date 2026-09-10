"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    label: "Years of Industry Expertise",
    target: 15,
    suffix: "+",
    className: "border-b",
  },
  {
    label: "Machines Installed",
    target: 499,
    suffix: "+",
    className: "border-b sm:border-l sm:pl-8",
  },
  {
    label: "Satisfied Clients Worldwide",
    target: 100,
    suffix: "+",
    className: "border-b sm:border-b-0",
  },
  {
    label: "Turnkey Projects Delivered",
    target: 50,
    suffix: "+",
    className: "sm:border-l sm:pl-8",
  },
];

function AnimatedNumber({ target, suffix, inView }) {
  const elRef = useRef(null);

  useEffect(() => {
    if (!inView || !elRef.current) return;
    const duration = 1500;
    const start = performance.now();
    let raf;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      if (elRef.current) {
        elRef.current.textContent = `${Math.round(progress * target)}${suffix}`;
      }
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [inView, target, suffix]);

  return <span ref={elRef}>{`0${suffix}`}</span>;
}

export default function Process() {
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="process" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
        Delivering Processing Solutions
        <br />
        Across Borders
      </h1>

      <div className="mt-[3rem] sm:mt-[4rem] flex flex-col gap-8 max-w-3xl">
        <p className="text-lg sm:text-xl leading-relaxed text-justify opacity-70">
          DOSTAN proudly serves clients across India, Asia, Africa, the
          Middle East, and other international markets, delivering reliable
          processing solutions to a growing range of food manufacturing
          industries.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed text-justify opacity-70">
          Built on a commitment to quality, engineering excellence, and
          customer satisfaction, DOSTAN continues to expand its global
          footprint—bringing dependable machinery and processing expertise to
          production facilities across borders.
        </p>
      </div>

      <div
        ref={statsRef}
        className="mt-[4rem] sm:mt-[6rem] grid grid-cols-1 sm:grid-cols-2"
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`py-8 border-[#DDDDDD] ${stat.className}`}
          >
            <p className="text-base sm:text-lg">{stat.label}</p>
            <p className="mt-2 text-7xl sm:text-8xl lg:text-9xl leading-none text-accent">
              <AnimatedNumber
                target={stat.target}
                suffix={stat.suffix}
                inView={inView}
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
