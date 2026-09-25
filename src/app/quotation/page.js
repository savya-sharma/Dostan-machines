import { Suspense } from "react";
import QuotationForm from "@/components/QuotationForm";

export const metadata = {
  title: "Get a Quote | Dostan Machines",
};

export default function QuotationPage() {
  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <h1 className="max-w-2xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
        Get a Quote
      </h1>
      <p className="mt-4 max-w-xl text-sm opacity-70 sm:text-base">
        Tell us about the machinery or turnkey plant you need — individual
        equipment, a full production line, a plant upgrade, or something
        custom — and our team will get back to you with a tailored
        quotation.
      </p>

      <Suspense fallback={null}>
        <QuotationForm />
      </Suspense>
    </div>
  );
}
