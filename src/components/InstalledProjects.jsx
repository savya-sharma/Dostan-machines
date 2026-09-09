"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CornerDownRight } from "lucide-react";

const SMALL_CAPTIONS = [
  {
    caption:
      "From concept to completion, every installation is executed with reliable solutions tailored to each project's requirements.",
    image: "/images/machines/CONTINUOUS-FREEZER-MACHINE.webp",
  },
  {
    caption:
      "From concept to completion, every installation is executed with precision and purpose. We combine quality .",
    image: "/images/machines/HARDENING-TUNNEL-MACHINE.webp",
  },
  {
    caption:
      "From concept to completion, every installation is executed with precision and purpose. We combine quality craftsmanship",
    image: "/images/machines/High-PRESSURE-HOMOGENIZER-MACHINE.webp",
  },
];

const LARGE_CAPTION =
  "From concept to completion, every installation is executed with precision and purpose. We combine quality craftsmanship with reliable solutions tailored to each project's requirements.";

const LARGE_IMAGES = [
  "/images/machines/CHOCOBAR-MACHINE.webp",
  "/images/machines/MULTI-PRODUCT-ICE-CREAM-FACTORY-MACHINE.webp",
];

const VIDEOS = [
  "/videos/installed/video_01.mp4",
  "/videos/installed/video_02.mp4",
  "/videos/installed/video_3.mp4",
  "/videos/installed/video_4.mp4",
];

export default function InstalledProjects() {
  const videoRefs = useRef([]);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);
    if (videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="installed-projects" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
        Installed Projects
      </h1>

      <div className="mt-[3rem] flex flex-col gap-8 sm:flex-row sm:gap-16">
        <p className="text-sm text-justify opacity-70 sm:w-1/2">
          Explore DOSTAN installations across diverse production
          environments, where engineered machinery is brought together to
          deliver complete, reliable processing solutions.
        </p>
        <p className="text-sm text-justify opacity-70 sm:w-1/2">
          From individual equipment installations to complete processing
          systems, each project reflects our focus on precision, performance,
          and dependable production.
        </p>
      </div>

      <div className="mt-[4rem] grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {SMALL_CAPTIONS.map((item, index) => (
          <div key={index}>
            <div className="relative aspect-square bg-line">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-xs text-justify opacity-70">
              {item.caption}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-[4rem] grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
        <div>
          <div className="relative aspect-square bg-line">
            <Image
              src={LARGE_IMAGES[0]}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-justify opacity-70">
            {LARGE_CAPTION}
          </p>
        </div>
        <div>
          <div className="relative aspect-square bg-line">
            <Image
              src={LARGE_IMAGES[1]}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-justify text-right opacity-70">
            {LARGE_CAPTION}
          </p>
        </div>
      </div>

      <div className="mt-[4rem] flex justify-center">
        <a
          className="flex items-center gap-[0.4rem] text-sm font-medium transition-colors hover:text-accent"
          href="#installed-projects"
        >
          View all projects <CornerDownRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-[4rem] grid grid-cols-1 gap-6 sm:grid-cols-3">
        {VIDEOS.map((src, index) => (
          <video
            key={src}
            ref={(el) => (videoRefs.current[index] = el)}
            className="aspect-square w-full bg-gray-300 object-cover"
            src={src}
            loop
            muted
            playsInline
            preload="metadata"
          />
        ))}
      </div>
    </div>
  );
}
