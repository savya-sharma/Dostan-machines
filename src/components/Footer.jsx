"use client";

import { handleAnchorClick } from "@/lib/scrollToHash";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-cover bg-center px-[2rem] pt-[6rem] text-white"
      style={{ backgroundImage: "url(/images/background/footerbg.webp)" }}
    >
      <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Navigate</h2>
            <div className="flex flex-col items-start gap-2">
              <a href="/#home" onClick={(e) => handleAnchorClick(e, "/#home")} className="text-sm transition-colors hover:text-accent">Home</a>
              <a href="/about" className="text-sm transition-colors hover:text-accent">About</a>
              <a href="/products" className="text-sm transition-colors hover:text-accent">Products</a>
              <a href="/contact" className="text-sm transition-colors hover:text-accent">Contact Us</a>
            </div>
            <div className="flex flex-col items-start gap-2">
              <a className="text-sm transition-colors hover:text-accent">Privacy Policy</a>
              <a className="text-sm transition-colors hover:text-accent">Terms Of Service</a>
              <a className="text-sm transition-colors hover:text-accent">Cookie Policy</a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Social</h2>
            <div className="flex flex-col items-start gap-2">
              <a className="text-sm transition-colors hover:text-accent">Instagram</a>
              <a className="text-sm transition-colors hover:text-accent">LinkedIn</a>
              <a
                href="https://www.youtube.com/@DostanMachines"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors hover:text-accent"
              >
                Youtube
              </a>
              <a className="text-sm transition-colors hover:text-accent">Facebook</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center text-sm font-semibold">
          DOSTAN
          <p className="max-w-xs font-normal">
            DOSTAN engineers reliable machinery and complete production
            solutions—built for precision and performance.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <div className="flex flex-col items-start gap-4 text-sm">
            <a
              href="tel:+918510027111"
              className="underline transition-colors hover:text-accent"
            >
              +91 8510027111 | +91 9266767144
            </a>
            <a
              href="mailto:dostanmachines@gmail.com"
              className="transition-colors hover:text-accent"
            >
              dostanmachines@gmail.com
            </a>
            <span className="max-w-xs underline">
              Plot No. 181, Udyog Kendra-1, Ecotech-III, Greater Noida, Gautam
              Buddha Nagar, Uttar Pradesh – 201306
            </span>
            <p className="opacity-70">&copy; 2026 Dostan Machines</p>
          </div>
        </div>
      </div>

      <div className="mt-[6rem] -mx-[2rem] flex h-[8vw] items-start justify-center overflow-hidden px-4">
        <h2 className="whitespace-nowrap text-[9vw] font-bold leading-none tracking-tight">
          DOSTAN MACHINES
        </h2>
      </div>
    </footer>
  );
}
