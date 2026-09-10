"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CornerDownRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DostanAdvantage() {
  const videoContainerRef = useRef(null);
  const videoInnerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoInnerRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, videoContainerRef);

    return () => ctx.revert();
  }, []);

  // Video only starts downloading/playing once it's about to enter the
  // viewport, instead of autoplaying (and fetching) as soon as the page
  // loads — this is the single largest asset on the homepage.
  useEffect(() => {
    const video = videoInnerRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="dostan-advantage" className="px-[2rem] py-[6rem]">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">Why Dostan Machines</h1>
        <p className="mt-[2rem] max-w-2xl text-justify text-[1.5rem] leading-[2rem] opacity-70 tracking-tight">
          We bring strategy, design, and technology together to create digital experiences that feel distinctive and purposeful. Every project is shaped around clarity, character, and a strong visual point of view. and give brands a presence that stays memorable long after the first interaction.
        </p>
        <div className="mt-[1.5rem] flex max-w-2xl justify-end">
          <a
            className="flex items-center gap-[0.4rem] text-sm font-medium text-accent transition-[gap,opacity] hover:gap-[0.6rem] hover:opacity-70"
            href="#"
          >
            About Dostan Machines <CornerDownRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-[5rem] flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
        <Image
          src="/logos/logo-01.svg"
          alt="Dostan Machines logo mark"
          width={80}
          height={77}
          className="h-24 w-auto shrink-0 sm:h-32 lg:h-[12rem]"
        />

        <p className="max-w-sm text-justify text-sm leading-relaxed opacity-70 tracking-tight">
          We create identities and digital experiences that give brands a distinctive voice in crowded spaces. Through thoughtful design and purposeful technology, we turn complex ideas into something simple, engaging, and memorable.
        </p>
      </div>

      <div
        ref={videoContainerRef}
        className="relative mt-[5rem] aspect-video w-full overflow-hidden bg-neutral-300"
      >
        <video
          ref={videoInnerRef}
          className="absolute inset-0 h-full w-full scale-125 object-cover"
          src="/videos/hero/dostan-video.mp4"
          loop
          muted
          playsInline
          preload="none"
        />
      </div>
    </div>
  )
}
