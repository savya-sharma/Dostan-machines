"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";
import { handleAnchorClick } from "@/lib/scrollToHash";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { findMachineByImage } from "@/data/machines";

// Every Solutions entry is an existing homepage section; descriptions are
// condensed from that section's own copy.
const SOLUTION_LINKS = [
  {
    label: "End-to-End Solutions",
    description: "From individual machines to complete processing systems.",
    href: "/#end-to-end-solutions",
  },
  {
    label: "Why Dostan Machines",
    description: "Engineering, manufacturing, installation and after-sales support.",
    href: "/#dostan-advantage",
  },
  {
    label: "Our Reach",
    description: "Processing solutions delivered across India and international markets.",
    href: "/#process",
  },
  {
    label: "Factory & Manufacturing",
    description: "Engineering and fabrication together under one roof.",
    href: "/#factory-manufacturing",
  },
  {
    label: "FAQ",
    description: "Answers to the questions we hear most often.",
    href: "/#faq",
  },
];

// The same six machines the homepage's Product Categories section features,
// looked up from the catalogue so names, purposes and links never drift.
const FEATURED_MACHINES = [
  "/images/machines/GALLERY-01.webp",
  "/images/machines/GALLERY-02.webp",
  "/images/machines/GALLERY-03.webp",
  "/images/machines/GALLERY-04.webp",
  "/images/machines/GALLERY-05.webp",
  "/images/machines/GALLERY-06.webp",
]
  .map(findMachineByImage)
  .filter(Boolean);

const NAV_LINKS = [
  { label: "Solutions", href: "/#end-to-end-solutions", menu: "solutions" },
  { label: "Explore Our Machinery", href: "/machinery", menu: "machinery" },
  { label: "Projects", href: "/#installed-projects" },
  { label: "About", href: "/about" },
];

const PHONE_DISPLAY = "+91 9266767144";
const PHONE_TEL = "+919266767144";

// Leaving the trigger for the panel crosses a small gap — this grace period
// keeps the dropdown from flickering shut on the way.
const HOVER_CLOSE_DELAY = 160;

const pad = (n) => String(n).padStart(2, "0");

// Navbar call/chat icon buttons: on hover (or while the phone popover is
// open) an ink circle grows from the point where the pointer entered and
// shrinks back toward where it left; keyboard focus grows it from the
// centre. The circle is 3× the button width, so it covers the button from
// any origin point.
const iconButtonClasses =
  "group/icon relative flex items-center justify-center overflow-hidden rounded-[0.7rem] border border-ink/20 p-2.5 text-ink transition-[color,border-color] duration-300 ease-out hover:border-ink hover:text-surface focus-visible:border-ink focus-visible:text-surface aria-expanded:border-ink aria-expanded:text-surface";
const iconButtonFillClasses =
  "pointer-events-none absolute left-[var(--fill-x,50%)] top-[var(--fill-y,50%)] aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-ink transition-transform duration-300 ease-out group-hover/icon:scale-100 group-focus-visible/icon:scale-100 group-aria-expanded/icon:scale-100";

// Records where the pointer crossed the button's edge, as the fill origin.
function trackFillOrigin(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--fill-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--fill-y", `${e.clientY - rect.top}px`);
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isActive(pathname, link) {
  if (link.menu === "machinery") return pathname.startsWith("/machinery");
  if (link.href.includes("#")) return false;
  return pathname === link.href;
}

// Hash links stay plain anchors so handleAnchorClick can hand same-page
// scrolling to Lenis; route links use client-side navigation.
function NavItemLink({ href, onNavigate, children, ...props }) {
  if (href.includes("#")) {
    return (
      <a
        href={href}
        onClick={(e) => {
          onNavigate?.();
          handleAnchorClick(e, href);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={() => onNavigate?.()} {...props}>
      {children}
    </Link>
  );
}

function SolutionsPanel({ onNavigate }) {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10">
      <ul className="grid grid-cols-2 gap-x-8">
        {SOLUTION_LINKS.map((link, i) => (
          <li key={link.href} data-menu-item>
            <NavItemLink
              href={link.href}
              onNavigate={onNavigate}
              className="group/item flex gap-4 border-b border-line/15 py-4 outline-none"
            >
              <span className="pt-1 font-mono text-[0.65rem] tracking-[0.2em] text-accent">
                {pad(i + 1)}
              </span>
              <span className="flex-1">
                <span className="flex items-center justify-between gap-3 text-sm font-medium text-ink transition-colors duration-300 group-hover/item:text-accent group-focus-visible/item:text-accent">
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100" />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink/50">
                  {link.description}
                </span>
              </span>
            </NavItemLink>
          </li>
        ))}
      </ul>

      <div
        data-menu-item
        className="flex flex-col justify-between gap-8 rounded-[0.7rem] bg-ink p-7 text-surface"
      >
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
            Turnkey
          </p>
          <p className="mt-3 text-lg font-medium leading-snug">
            Planning a complete production line?
          </p>
          <p className="mt-2 text-xs leading-relaxed text-surface/60">
            Tell us your product, capacity and layout — we&apos;ll scope the
            right solution.
          </p>
        </div>
        <Link
          href="/quotation"
          onClick={onNavigate}
          className="group/cta flex items-center justify-between border-t border-surface/15 pt-4 text-sm font-medium transition-colors duration-300 hover:text-accent"
        >
          Discuss your project
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

function MachineryPanel({ onNavigate }) {
  const [preview, setPreview] = useState(FEATURED_MACHINES[0]);
  const previewRef = useRef(null);

  // Soft cross-fade whenever the previewed machine changes.
  useEffect(() => {
    if (!previewRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      previewRef.current,
      { autoAlpha: 0, scale: 0.97 },
      { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" }
    );
  }, [preview]);

  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10">
      <div className="flex flex-col">
        <ul className="grid grid-cols-2 gap-x-8">
          {FEATURED_MACHINES.map((machine) => (
            <li key={machine.slug} data-menu-item>
              <Link
                href={`/machinery/${machine.slug}`}
                onClick={onNavigate}
                onPointerEnter={() => setPreview(machine)}
                onFocus={() => setPreview(machine)}
                className="group/item flex items-start justify-between gap-3 border-b border-line/15 py-4 outline-none"
              >
                <span>
                  <span className="block text-sm font-medium text-ink transition-colors duration-300 group-hover/item:text-accent group-focus-visible/item:text-accent">
                    {machine.name}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink/50">
                    {machine.purpose}
                  </span>
                </span>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
        <div data-menu-item className="mt-6 flex items-center">
          <Link
            href="/machinery"
            onClick={onNavigate}
            className="group/all flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-300 hover:text-accent"
          >
            View all machinery
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div
        data-menu-item
        className="relative overflow-hidden rounded-[0.7rem] bg-[radial-gradient(ellipse_at_center,#ffffff_35%,#ecece9_100%)]"
      >
        {preview && (
          <div ref={previewRef} className="absolute inset-0">
            <Image
              key={preview.slug}
              src={preview.image}
              alt=""
              fill
              sizes="320px"
              className="object-contain p-8 pb-14"
            />
            <p className="absolute inset-x-5 bottom-4 truncate text-xs text-ink/50">
              {preview.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const PANELS = { solutions: SolutionsPanel, machinery: MachineryPanel };

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [renderedMenu, setRenderedMenu] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const contactRef = useRef(null);
  const navRef = useRef(null);
  const panelRef = useRef(null);
  const prevRenderedMenuRef = useRef(null);
  const closeTimerRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayTlRef = useRef(null);
  const toggleRef = useRef(null);
  const indicatorRef = useRef(null);
  const indicatorShownRef = useRef(false);
  const hoveringLinksRef = useRef(false);

  // Glides the shared highlight onto `target` (a desktop nav item), or fades
  // it out when there's nothing to mark. The first placement snaps into
  // position so it never slides in from the corner.
  function moveIndicator(target) {
    const indicator = indicatorRef.current;
    const nav = navRef.current;
    if (!indicator || !nav) return;

    const rect = target?.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      gsap.to(indicator, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
      indicatorShownRef.current = false;
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const box = {
      x: rect.left - navRect.left - nav.clientLeft,
      y: rect.top - navRect.top - nav.clientTop,
      width: rect.width,
      height: rect.height,
    };
    if (!indicatorShownRef.current || prefersReducedMotion()) {
      gsap.set(indicator, box);
      gsap.to(indicator, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(indicator, { ...box, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
    }
    indicatorShownRef.current = true;
  }

  // Resting place: the open dropdown's trigger, else the current page.
  function restIndicator() {
    const nav = navRef.current;
    moveIndicator(
      nav?.querySelector('[data-nav-item][aria-expanded="true"]') ??
        nav?.querySelector("[data-nav-item][data-active]")
    );
  }

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Any navigation closes every menu.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setActiveMenu(null);
  }

  // A newly opened menu mounts its panel right away; closing keeps it
  // mounted until the exit animation finishes (see the layout effect).
  if (activeMenu && activeMenu !== renderedMenu) setRenderedMenu(activeMenu);
  if (isOpen && !overlayMounted) setOverlayMounted(true);

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

  // Desktop dropdown: Escape or a click outside the navbar closes it.
  useEffect(() => {
    if (!activeMenu) return;

    const handlePointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setActiveMenu(null);
    };
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      const trigger = navRef.current?.querySelector(`[data-menu-trigger="${activeMenu}"]`);
      setActiveMenu(null);
      trigger?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenu]);

  // Desktop dropdown animation: the panel unfolds downward on first open,
  // its items rise in on a short stagger, and switching between menus only
  // re-staggers the items instead of replaying the whole entrance.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const prev = prevRenderedMenuRef.current;
    prevRenderedMenuRef.current = renderedMenu;
    if (!panel) return;

    const items = panel.querySelectorAll("[data-menu-item]");
    const reduced = prefersReducedMotion();
    const shown = { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 0.75rem)" };

    if (!activeMenu) {
      gsap.killTweensOf([panel, items]);
      // Closing mirrors the opening: items sink back out last-first, then
      // the panel folds away.
      gsap
        .timeline({ onComplete: () => setRenderedMenu(null) })
        .to(items, {
          autoAlpha: 0,
          y: 8,
          duration: reduced ? 0 : 0.18,
          ease: "power2.in",
          stagger: { each: reduced ? 0 : 0.02, from: "end" },
        })
        .to(
          panel,
          { autoAlpha: 0, y: -6, duration: reduced ? 0 : 0.22, ease: "power2.in" },
          reduced ? 0 : "-=0.08"
        );
      return;
    }

    if (reduced) {
      gsap.set(panel, shown);
      gsap.set(items, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.killTweensOf([panel, items]);
    if (prev === null) {
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: -10, clipPath: "inset(0% 0% 100% 0% round 0.75rem)" },
        { ...shown, duration: 0.6, ease: "expo.out" }
      );
    } else {
      gsap.to(panel, { ...shown, duration: 0.2, ease: "power2.out" });
    }
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.035,
        delay: prev === null ? 0.12 : 0,
      }
    );
  }, [activeMenu, renderedMenu]);

  // Full-screen menu (below lg): a curtain wipes down, then the links rise
  // out of their masks one after another. Closing plays it back faster.
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => setOverlayMounted(false),
    });
    tl.fromTo(
      overlay,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" }
    )
      .fromTo(
        overlay.querySelectorAll("[data-overlay-link]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.06 },
        "-=0.35"
      )
      .fromTo(
        overlay.querySelectorAll("[data-overlay-fade]"),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 },
        "-=0.6"
      );
    overlayTlRef.current = tl;

    return () => {
      tl.kill();
      overlayTlRef.current = null;
    };
  }, [overlayMounted]);

  useEffect(() => {
    const tl = overlayTlRef.current;
    if (!tl) return;

    // Reduced motion runs the same timeline near-instantly, so the close
    // still ends through onReverseComplete.
    const reduced = prefersReducedMotion();
    if (isOpen) tl.timeScale(reduced ? 100 : 1).play();
    else tl.timeScale(reduced ? 100 : 1.8).reverse();
  }, [isOpen, overlayMounted]);

  // While the full-screen menu is open: freeze page scroll, keep focus
  // inside the menu, close on Escape, and close if the viewport grows past
  // the breakpoint where the menu is hidden.
  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.lenis?.stop();

    const firstLink = overlayRef.current?.querySelector("a, button");
    firstLink?.focus({ preventScroll: true });

    const toggle = toggleRef.current;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;
      const focusables = [
        toggle,
        ...overlayRef.current.querySelectorAll("a[href], button:not([disabled])"),
      ].filter((el) => el && el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleBreakpoint = (e) => {
      if (e.matches) setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleBreakpoint);
    return () => {
      html.style.overflow = previousOverflow;
      window.lenis?.start();
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleBreakpoint);
      toggle?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  // Settle the highlight whenever the page or the open dropdown changes —
  // unless the pointer is over the links, where hover already drives it.
  useLayoutEffect(() => {
    if (!hoveringLinksRef.current) restIndicator();
  });

  // Item widths shift once the web font loads and on resize; re-measure.
  useEffect(() => {
    const handleResize = () => restIndicator();
    document.fonts?.ready.then(handleResize);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openMenu = (menu) => {
    clearTimeout(closeTimerRef.current);
    setActiveMenu(menu);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), HOVER_CLOSE_DELAY);
  };
  const closeMenus = () => {
    clearTimeout(closeTimerRef.current);
    setActiveMenu(null);
    setIsOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access unavailable; ignore
    }
  };

  const RenderedPanel = renderedMenu ? PANELS[renderedMenu] : null;
  const quoteActive = pathname === "/quotation";

  return (
    <header className="fixed inset-x-[2rem] top-4 z-50">
      <nav
        ref={navRef}
        aria-label="Main"
        onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
        onPointerEnter={() => clearTimeout(closeTimerRef.current)}
        className={`relative z-10 flex items-center justify-between gap-6 rounded-md border px-6 py-3 transition-[background-color,border-color,box-shadow,backdrop-filter,color] duration-500 ease-out sm:px-8 ${
          isOpen
            ? "border-transparent bg-transparent text-surface shadow-none"
            : scrolled || activeMenu
              ? "border-line/25 bg-surface/85 text-ink shadow-[0_8px_30px_-12px_rgba(17,19,21,0.18)] backdrop-blur-xl"
              : "border-line/15 bg-surface/60 text-ink shadow-[0_4px_24px_-12px_rgba(17,19,21,0.10)] backdrop-blur-lg"
        }`}
      >
        <Link href="/" onClick={closeMenus} className="flex shrink-0 items-center gap-2">
          <Image
            src="/logos/logo-01.svg"
            alt="Dostan Machines"
            width={28}
            height={27}
            className="h-6 w-auto"
          />
          <span className="text-lg font-semibold">Dostan Machines</span>
        </Link>

        {/* Sliding highlight shared by every desktop link — see moveIndicator. */}
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 hidden rounded-[0.6rem] bg-ink/[0.06] lg:block"
        />

        <ul
          className="hidden items-center gap-1 lg:flex"
          onPointerEnter={() => (hoveringLinksRef.current = true)}
          onPointerLeave={() => {
            hoveringLinksRef.current = false;
            restIndicator();
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) restIndicator();
          }}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link);
            const itemClasses = `relative flex items-center gap-1.5 rounded-[0.6rem] px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
              active || activeMenu === link.menu ? "text-ink" : "text-ink/70 hover:text-ink"
            }`;
            const indicatorProps = {
              "data-nav-item": "",
              "data-active": active || undefined,
              onFocus: (e) => moveIndicator(e.currentTarget),
            };

            if (!link.menu) {
              return (
                <li key={link.href}>
                  <NavItemLink
                    href={link.href}
                    onNavigate={closeMenus}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "mouse") return;
                      setActiveMenu(null);
                      moveIndicator(e.currentTarget);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={itemClasses}
                    {...indicatorProps}
                  >
                    {link.label}
                  </NavItemLink>
                </li>
              );
            }

            const expanded = activeMenu === link.menu;
            return (
              <li key={link.href}>
                <button
                  type="button"
                  data-menu-trigger={link.menu}
                  aria-expanded={expanded}
                  aria-controls={`nav-panel-${link.menu}`}
                  onClick={() => (expanded ? setActiveMenu(null) : openMenu(link.menu))}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    openMenu(link.menu);
                    moveIndicator(e.currentTarget);
                  }}
                  className={`cursor-pointer ${itemClasses}`}
                  {...indicatorProps}
                >
                  {link.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      expanded ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                {renderedMenu === link.menu && (
                  // Positioned against the nav bar so it spans its full
                  // width; the top padding bridges the gap for the pointer.
                  <div
                    id={`nav-panel-${link.menu}`}
                    className="absolute inset-x-0 top-full pt-2"
                  >
                    <div
                      ref={panelRef}
                      className="invisible rounded-xl border border-line/20 bg-surface p-8 shadow-[0_30px_60px_-30px_rgba(17,19,21,0.35)]"
                    >
                      <RenderedPanel onNavigate={closeMenus} />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <div ref={contactRef} className="relative">
            <button
              type="button"
              onClick={() => setContactOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={contactOpen}
              aria-label="Show phone number"
              onPointerEnter={trackFillOrigin}
              onPointerLeave={trackFillOrigin}
              className={`cursor-pointer ${iconButtonClasses}`}
            >
              <span aria-hidden="true" className={iconButtonFillClasses} />
              <Phone className="relative h-4 w-4" />
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
            onPointerEnter={trackFillOrigin}
            onPointerLeave={trackFillOrigin}
            className={iconButtonClasses}
          >
            <span aria-hidden="true" className={iconButtonFillClasses} />
            <MessageCircle className="relative h-4 w-4" />
          </a>
          <Link
            href="/quotation"
            onClick={closeMenus}
            aria-current={quoteActive ? "page" : undefined}
            className="group flex items-center gap-2 rounded-[0.7rem] bg-gradient-to-br from-[#D71920] to-[#111315] px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-surface transition-opacity duration-300 hover:opacity-90"
          >
            Get a Quote
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center lg:hidden"
        >
          <span
            aria-hidden="true"
            className={`absolute h-[1.5px] w-6 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isOpen ? "rotate-45" : "-translate-y-[4px]"
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute h-[1.5px] rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isOpen ? "w-6 -rotate-45" : "w-6 translate-y-[4px]"
            }`}
          />
        </button>
      </nav>

      {overlayMounted && (
        <div
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-lenis-prevent
          className="fixed inset-0 overflow-y-auto overscroll-contain bg-ink text-surface lg:hidden"
          style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        >
          <div className="flex min-h-full flex-col px-[2rem] pt-32 pb-10">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(pathname, link);
                const sectionOpen = mobileSection === link.menu;
                const subLinks =
                  link.menu === "solutions"
                    ? [...SOLUTION_LINKS.map(({ label, href }) => ({ label, href }))]
                    : link.menu === "machinery"
                      ? [
                          ...FEATURED_MACHINES.map((m) => ({
                            label: m.name,
                            href: `/machinery/${m.slug}`,
                          })),
                          { label: "View all machinery", href: "/machinery", strong: true },
                        ]
                      : null;

                const labelContent = (
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[0.65rem] tracking-[0.2em] text-accent">
                      {pad(i + 1)}
                    </span>
                    <span className={active ? "text-accent" : ""}>{link.label}</span>
                  </span>
                );

                return (
                  <li key={link.href} className="border-b border-surface/10">
                    <div className="overflow-hidden">
                      <div data-overlay-link>
                        {subLinks ? (
                          <button
                            type="button"
                            onClick={() =>
                              setMobileSection((prev) => (prev === link.menu ? null : link.menu))
                            }
                            aria-expanded={sectionOpen}
                            aria-controls={`mobile-sub-${link.menu}`}
                            className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-3xl font-medium tracking-tight sm:text-4xl"
                          >
                            {labelContent}
                            <Plus
                              aria-hidden="true"
                              className={`h-5 w-5 shrink-0 text-surface/50 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                                sectionOpen ? "rotate-45 text-accent" : ""
                              }`}
                            />
                          </button>
                        ) : (
                          <NavItemLink
                            href={link.href}
                            onNavigate={closeMenus}
                            aria-current={active ? "page" : undefined}
                            className="flex py-5 text-3xl font-medium tracking-tight transition-colors duration-300 hover:text-accent sm:text-4xl"
                          >
                            {labelContent}
                          </NavItemLink>
                        )}
                      </div>
                    </div>

                    {subLinks && (
                      <div
                        id={`mobile-sub-${link.menu}`}
                        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                          sectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <ul
                          inert={!sectionOpen}
                          className="flex flex-col overflow-hidden pl-9"
                        >
                          {subLinks.map((sub, subIndex) => (
                            // Staggered rise on open; reverse order on close.
                            <li
                              key={sub.href}
                              className={`transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none ${
                                sectionOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                              }`}
                              style={{
                                transitionDelay: `${
                                  (sectionOpen ? subIndex : subLinks.length - 1 - subIndex) * 30
                                }ms`,
                              }}
                            >
                              <NavItemLink
                                href={sub.href}
                                onNavigate={closeMenus}
                                className={`flex items-center justify-between gap-4 py-2.5 text-base transition-colors duration-300 hover:text-accent ${
                                  sub.strong ? "font-medium text-surface" : "text-surface/60"
                                }`}
                              >
                                {sub.label}
                                {sub.strong && <ArrowUpRight className="h-4 w-4" />}
                              </NavItemLink>
                            </li>
                          ))}
                          <li aria-hidden="true" className="h-4" />
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex flex-col gap-6 pt-12">
              <Link
                data-overlay-fade
                href="/quotation"
                onClick={closeMenus}
                aria-current={quoteActive ? "page" : undefined}
                className="group flex items-center justify-between rounded-[0.7rem] bg-accent px-6 py-4 text-sm font-bold uppercase tracking-wide text-surface transition-colors duration-300 hover:bg-[#b8141a]"
              >
                Get a Quote
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <div
                data-overlay-fade
                className="flex flex-wrap items-center justify-between gap-4 text-sm text-surface/60"
              >
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="flex items-center gap-2 transition-colors duration-300 hover:text-surface"
                >
                  <Phone className="h-4 w-4" />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors duration-300 hover:text-surface"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
