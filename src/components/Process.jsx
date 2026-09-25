"use client";

import { useEffect, useRef, useState } from "react";

// Rendered as a staggered two-column layout below: STATS[0]/[2] form the
// left column, STATS[1]/[3] the right column (offset lower, per the
// reference design).
const STATS = [
  { label: "Years of Industry Expertise", target: 15, suffix: "+" },
  { label: "Machines Installed", target: 499, suffix: "+" },
  { label: "Satisfied Clients Worldwide", target: 100, suffix: "+" },
  { label: "Turnkey Projects Delivered", target: 50, suffix: "+" },
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
        Delivering Processing
        <br />
        <span className="block pl-12 sm:pl-16 lg:pl-20">
          Solutions Across Borders
        </span>
      </h1>

      <div className="mt-[3rem] sm:mt-[4rem] max-w-3xl">
        <p className="text-lg sm:text-xl leading-relaxed text-justify opacity-70">
          DOSTAN delivers processing machinery and solutions across India,
          Asia, Africa, the Middle East, and international markets,
          supporting food manufacturers with dependable equipment and
          production expertise. From individual machinery to complete
          processing solutions, we work across borders to bring practical
          engineering, reliable execution, and technical support closer to
          every production facility.
        </p>
      </div>

      <div
        ref={statsRef}
        className="mt-[4rem] sm:mt-[6rem] grid grid-cols-1 sm:grid-cols-2"
      >
        <div className="flex flex-col">
          <StatBlock stat={STATS[0]} inView={inView} className="border-b" />
          <StatBlock stat={STATS[2]} inView={inView} />
        </div>
        <div className="flex flex-col sm:border-l sm:pl-8 border-[#DDDDDD]">
          <StatBlock
            stat={STATS[1]}
            inView={inView}
            className="border-b sm:pt-20 lg:pt-24"
          />
          <StatBlock stat={STATS[3]} inView={inView} />
        </div>
      </div>
    </div>
  );
}

function StatBlock({ stat, inView, className = "" }) {
  return (
    <div className={`py-8 border-[#DDDDDD] ${className}`}>
      <p className="text-base sm:text-lg">{stat.label}</p>
      <p className="mt-2 text-7xl sm:text-8xl lg:text-9xl leading-none text-accent">
        <AnimatedNumber target={stat.target} suffix={stat.suffix} inView={inView} />
      </p>
    </div>
  );
}
