"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Copy, Check, MessageCircle } from "lucide-react";
import { handleAnchorClick } from "@/lib/scrollToHash";
import { getWhatsAppLink } from "@/lib/whatsapp";

const NAV_LINKS = [
  { label: "Solutions", href: "/#end-to-end-solutions" },
  { label: "Explore Our Machinery", href: "/machinery" },
  { label: "Projects", href: "/#installed-projects" },
  { label: "About", href: "/about" },
];

const PHONE_DISPLAY = "+91 8510027111";
const PHONE_TEL = "+918510027111";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const contactRef = useRef(null);

  // Grounds the glass navbar with slightly more opacity/blur once the page
  // has scrolled a touch, rather than leaving it at its lightest, most
  // transparent resting state for the whole page.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!contactOpen) return;

    const handlePointerDown = (e) => {
      if (contactRef.current && !contactRef.current.contains(e.target)) {
        setContactOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setContactOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contactOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access unavailable; ignore
    }
  };

  return (
    <header className="fixed inset-x-[2rem] top-4 z-50">
      <nav
        className={`flex items-center justify-between gap-6 rounded-md border px-6 py-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out sm:px-8 ${
          scrolled
            ? "border-line/25 bg-surface/85 shadow-[0_8px_30px_-12px_rgba(17,19,21,0.18)] backdrop-blur-xl"
            : "border-line/15 bg-surface/60 shadow-[0_4px_24px_-12px_rgba(17,19,21,0.10)] backdrop-blur-lg"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logos/logo-01.svg"
            alt="Dostan Machines"
            width={28}
            height={27}
            className="h-6 w-auto"
          />
          <span className="text-lg font-semibold text-ink">
            Dostan Machines
          </span>
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
          <div ref={contactRef} className="relative">
            <button
              type="button"
              onClick={() => setContactOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={contactOpen}
              aria-label="Show phone number"
              className="flex cursor-pointer items-center justify-center rounded-[0.7rem] border border-ink/20 p-2.5 text-ink transition-colors hover:border-ink hover:text-accent"
            >
              <Phone className="h-4 w-4" />
            </button>

            <div
              className={`absolute right-0 top-full mt-2 origin-top-right rounded-xl bg-ink px-4 py-3 shadow-lg transition-all duration-200 ease-out ${
                contactOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-95 opacity-0"
              }`}
            >
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="whitespace-nowrap text-sm font-medium text-surface transition-colors hover:text-accent"
                >
                  {PHONE_DISPLAY}
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy phone number"
                  className="cursor-pointer text-surface/70 transition-colors hover:text-surface"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center justify-center rounded-[0.7rem] border border-ink/20 p-2.5 text-ink transition-colors hover:border-ink hover:text-accent"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href="/quotation"
            className="rounded-[0.7rem] bg-gradient-to-br from-[#D71920] to-[#111315] px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-surface transition-opacity hover:opacity-90"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="mt-2 rounded-3xl border border-line/25 bg-surface/85 px-6 py-6 shadow-[0_8px_30px_-12px_rgba(17,19,21,0.18)] backdrop-blur-xl lg:hidden">
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
              href="/quotation"
              onClick={() => setIsOpen(false)}
              className="rounded-[0.7rem] bg-gradient-to-br from-[#D71920] to-[#111315] px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-surface"
            >
              Get a Quote
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => setIsOpen(false)}
              aria-label={`Call ${PHONE_DISPLAY}`}
              className="flex w-fit items-center justify-center self-start rounded-[0.7rem] border border-ink/20 p-2.5 text-ink"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex w-fit items-center justify-center self-start rounded-[0.7rem] border border-ink/20 p-2.5 text-ink"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
