"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const FRAME_COUNT = 795;
const framePath = (index) =>
  `/compressed_images/frame_${String(index).padStart(4, "0")}.jpg`;

export default function Hero() {
  const canvasRef = useRef(null);
  const parentRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const images = [];
    const frameState = { currentIndex: 0 };
    let lenis;
    let cancelled = false;

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawFrame(index) {
      index = Math.max(0, Math.min(images.length - 1, index));
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      setCanvasSize();
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }

    function startScrollAnimation() {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      gsap.to(frameState, {
        currentIndex: images.length - 1,
        ease: "none",
        scrollTrigger: {
          trigger: parentRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
          pin: pinRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            drawFrame(Math.floor(frameState.currentIndex));
          },
        },
      });
    }

    let settledCount = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      const onSettle = () => {
        settledCount++;
        if (settledCount === FRAME_COUNT && !cancelled) {
          drawFrame(0);
          startScrollAnimation();
        }
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      images.push(img);
    }

    function onResize() {
      drawFrame(Math.floor(frameState.currentIndex));
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-surface">
      <div ref={parentRef} className="relative h-[700vh] w-full">
        <div ref={pinRef} className="h-screen w-full">
          <canvas ref={canvasRef} className="h-screen w-full" />
        </div>
      </div>
    </section>
  );
}
