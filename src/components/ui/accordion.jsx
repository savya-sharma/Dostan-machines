"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";

function Accordion({ className, ...props }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-line/20 last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left outline-none transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// The height/mount lifecycle stays on Base UI's own measured-height CSS
// transition (`--accordion-panel-height`, `data-starting/ending-style`) —
// that's what lets it correctly defer hiding the panel from assistive tech
// until the transition actually finishes, rather than clipping it
// instantly. GSAP (in FAQ.jsx) layers the opacity/y reveal and icon
// rotation on top of this, rather than replacing it.
const AccordionContent = React.forwardRef(function AccordionContent(
  { className, children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Panel
      ref={ref}
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn("pr-10 pb-6", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
