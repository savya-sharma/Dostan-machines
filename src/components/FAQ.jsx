"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    value: "machinery",
    question: "What types of machinery does DOSTAN manufacture?",
    answer:
      "We manufacture food and dairy processing machinery, including pasteurizers, homogenizers, continuous freezers, cooling towers, and plate heat exchangers.",
  },
  {
    value: "custom-design",
    question: "Can DOSTAN design machinery according to our production requirements?",
    answer:
      "Yes. Every machine is engineered around your specific production goals, product type, and capacity.",
  },
  {
    value: "installation",
    question: "Does DOSTAN provide installation and commissioning?",
    answer:
      "Yes, our team handles installation and commissioning on-site until your line reaches successful production.",
  },
  {
    value: "industries",
    question: "What industries does DOSTAN serve?",
    answer:
      "We primarily serve the food, dairy, and beverage processing industries, along with related manufacturing sectors.",
  },
  {
    value: "contact",
    question: "How can I discuss my machinery requirements with DOSTAN?",
    answer:
      "You can reach our team directly through the contact details in the footer to discuss your requirements.",
  },
];

const DEFAULT_OPEN = ["machinery"];

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// A custom two-bar plus/minus indicator rather than a swapped chevron: the
// horizontal bar stays fixed and the vertical bar rotates onto it as the
// panel opens, so the toggle itself reads as one precise, intentional
// rotation rather than two icons swapping instantly.
function PlusMinusIcon({ open, active }) {
  const verticalRef = useRef(null);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (verticalRef.current) {
      gsap.set(verticalRef.current, { rotate: open ? 90 : 0 });
    }
    // Sets only the initial state on mount — the animated transition on
    // subsequent changes is handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!verticalRef.current) return;
    if (prefersReducedMotion()) {
      gsap.set(verticalRef.current, { rotate: open ? 90 : 0 });
      return;
    }
    gsap.to(verticalRef.current, {
      rotate: open ? 90 : 0,
      duration: 0.4,
      ease: "power3.inOut",
    });
  }, [open]);

  return (
    <span
      className={`relative inline-flex h-4 w-4 shrink-0 items-center justify-center transition-colors duration-200 ${
        active ? "text-accent" : "text-ink/60"
      }`}
    >
      <span className="absolute h-[1.5px] w-4 bg-current" aria-hidden="true" />
      <span
        ref={verticalRef}
        className="absolute h-4 w-[1.5px] bg-current"
        aria-hidden="true"
      />
    </span>
  );
}

function FaqItem({ faq, open }) {
  const contentRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = contentRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: open ? 1 : 0, y: 0 });
      return;
    }

    gsap.killTweensOf(el);
    if (open) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.08, ease: "power2.out" }
      );
    } else {
      gsap.to(el, { opacity: 0, y: -6, duration: 0.18, ease: "power1.in" });
    }
  }, [open]);

  return (
    <AccordionItem value={faq.value}>
      <AccordionTrigger className="group/faq-trigger">
        <span
          className={`text-base transition-colors duration-200 group-hover/faq-trigger:text-accent ${
            open ? "font-semibold text-ink" : "font-medium text-ink/80"
          }`}
        >
          {faq.question}
        </span>
        <PlusMinusIcon open={open} active={open} />
      </AccordionTrigger>
      <AccordionContent>
        <div ref={contentRef} className="text-sm leading-relaxed text-ink/70">
          {faq.answer}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FAQ() {
  // Controlled at the root (rather than each item tracking its own
  // open/close via a per-item callback) so every item's GSAP reveal and
  // icon rotation reacts correctly — including the previously-open item,
  // which the accordion closes as a side effect of opening a new one, not
  // through its own trigger.
  const [value, setValue] = useState(DEFAULT_OPEN);

  return (
    <div id="faq" className="px-[2rem] py-[6rem]">
      <div className="flex flex-col gap-8 sm:flex-row">
        <h1 className="text-3xl leading-tight sm:w-1/4 sm:text-4xl lg:text-5xl">
          Frequent Ask Questions
        </h1>

        <Accordion value={value} onValueChange={setValue} className="max-w-lg">
          {FAQS.map((faq) => (
            <FaqItem
              key={faq.value}
              faq={faq}
              open={value.includes(faq.value)}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
