"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

const NAV_LINKS = [
  { label: "Solution", href: "#end-to-end-solutions" },
  { label: "Categories", href: "#product-categories" },
  { label: "Projects", href: "#installed-projects" },
  { label: "Installations", href: "#factory-manufacturing" },
  { label: "About", href: "#dostan-advantage" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-8">
      <nav className="flex items-center justify-between gap-3 rounded-xl bg-ink/90 px-3 py-1.5 backdrop-blur-sm sm:px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo-02.svg"
            alt="Dostan Machines"
            width={28}
            height={24}
            className="h-6 w-auto"
          />
          <span className="text-sm font-semibold text-surface">Dostan</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-surface transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="tel:+919876543210"
            aria-label="Call us"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface/30 text-surface transition-colors hover:border-accent hover:text-accent"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-surface transition-opacity hover:opacity-90"
          >
            Get a Quote
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition-opacity hover:opacity-90"
          >
            Request Demo
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-surface/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition-opacity hover:opacity-90"
          >
            Contact Us
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="text-surface lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-6 w-6"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="mt-2 rounded-xl bg-ink/90 px-4 py-4 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-surface transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-accent px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-surface"
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
