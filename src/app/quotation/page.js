import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import QuotationForm from "@/components/QuotationForm";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Get a Quote | Dostan Machines",
};

const DIRECT_CONTACTS = [
  { label: "Call", value: "+91 9266767144", href: "tel:+919266767144" },
  {
    label: "Email",
    value: "dostanmachines@gmail.com",
    href: "mailto:dostanmachines@gmail.com",
  },
  { label: "WhatsApp", value: "Send your requirement", href: getWhatsAppLink(), external: true },
];

export default function QuotationPage() {
  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <aside className="flex flex-col gap-12 lg:sticky lg:top-[6.5rem] lg:self-start lg:pt-6">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">
              Quotation
            </p>
            <h1 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Get a Quote
            </h1>
            <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed opacity-70 sm:text-base">
              Tell us about the machinery or turnkey plant you need — individual
              equipment, a full production line, a plant upgrade, or something
              custom — and our team will get back to you with a tailored
              quotation.
            </p>
          </div>

          <div className="max-w-md">
            <p className="text-[0.8rem] text-ink/50">Prefer to talk directly?</p>
            <ul className="mt-3 border-t border-[#DDDDDD]">
              {DIRECT_CONTACTS.map((contact) => (
                <li key={contact.label} className="border-b border-[#DDDDDD]">
                  <a
                    href={contact.href}
                    {...(contact.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="group flex items-center justify-between gap-4 py-4 text-sm"
                  >
                    <span className="text-ink/50">{contact.label}</span>
                    <span className="flex items-center gap-2 transition-colors duration-300 group-hover:text-accent">
                      {contact.value}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <Suspense fallback={null}>
          <QuotationForm />
        </Suspense>
      </div>
    </div>
  );
}
