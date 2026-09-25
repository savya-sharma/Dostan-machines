import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ContactCTA() {
  return (
    <div id="get-in-touch" className="px-[2rem] py-[6rem]">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
          Ready to discuss your requirements?
        </h1>
        <p className="max-w-md text-sm opacity-70">
          Tell us what you need. Our team will help you find the right
          machinery or turnkey solution.
        </p>

        <div className="mt-[1rem] flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/quotation"
            className="rounded-[0.7rem] bg-ink px-8 py-3 text-center text-sm font-bold uppercase tracking-wide text-surface transition-opacity hover:opacity-90"
          >
            Get a Quote
          </a>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[0.7rem] border border-ink/20 px-8 py-3 text-center text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink hover:text-accent"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            Send Requirement on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
