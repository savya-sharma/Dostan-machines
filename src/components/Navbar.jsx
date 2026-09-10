"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { handleAnchorClick } from "@/lib/scrollToHash";

const NAV_LINKS = [
  { label: "Solutions", href: "/#end-to-end-solutions" },
  { label: "Categories", href: "/#product-categories" },
  { label: "Projects", href: "/#installed-projects" },
  { label: "Installations", href: "/#factory-manufacturing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between gap-6 rounded-md bg-surface px-6 py-3 shadow-lg sm:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logos/logo-02.svg"
              alt="Dostan Machines"
              width={28}
              height={24}
              className="h-6 w-auto"
            />
            <span className="text-lg font-semibold text-ink">Dostan</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium text-ink transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href="/contact"
              className="rounded-full border border-ink/20 px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink hover:text-accent"
            >
              Contact Us
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleAnchorClick(e, "/#contact")}
              className="rounded-full bg-ink px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-surface transition-opacity hover:opacity-90"
            >
              Get a Quote
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="text-ink lg:hidden"
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
          <div className="mt-2 rounded-3xl bg-surface px-6 py-6 shadow-lg lg:hidden">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleAnchorClick(e, link.href);
                  }}
                  className="self-start text-sm font-medium text-ink transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={(e) => {
                  setIsOpen(false);
                  handleAnchorClick(e, "/#contact");
                }}
                className="rounded-full bg-ink px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-surface"
              >
                Get a Quote
              </a>
              <a
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-ink/20 px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-ink"
              >
                Contact Us
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
