import { notFound } from "next/navigation";
import Link from "next/link";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { MACHINES, findMachineBySlug } from "@/data/machines";
import { getMachineWhatsAppLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  return MACHINES.map((machine) => ({ slug: machine.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const machine = findMachineBySlug(slug);
  if (!machine) return { title: "Machine Not Found | Dostan Machines" };
  return { title: `${machine.name} | Dostan Machines` };
}

function DetailList({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="text-sm font-medium text-ink">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-ink/70">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpecsTable({ specifications }) {
  if (!specifications || specifications.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="text-sm font-medium text-ink">
        Technical Specifications
      </h2>
      <dl className="mt-3 flex flex-col divide-y divide-line/20">
        {specifications.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 py-2 text-sm"
          >
            <dt className="text-ink/70">{spec.label}</dt>
            <dd className="font-medium text-ink">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default async function MachineDetailPage({ params }) {
  const { slug } = await params;
  const machine = findMachineBySlug(slug);
  if (!machine) notFound();

  const quoteHref = `/quotation?machine=${machine.slug}`;
  const whatsappHref = getMachineWhatsAppLink(machine.name);

  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <div className="flex justify-end">
        <Link
          href="/machinery"
          className="rounded-[0.7rem] bg-line/15 px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-line/25"
        >
          Back to Machines
        </Link>
      </div>

      <div className="mt-[2rem] grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative aspect-square bg-line">
          <ImageWithSkeleton
            src={machine.image}
            alt={machine.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {machine.name}
          </h1>
          {machine.purpose && (
            <p className="mt-3 text-sm text-ink/70">{machine.purpose}</p>
          )}

          <DetailList title="Features" items={machine.features} />
          <DetailList title="Highlights" items={machine.highlights} />
          <SpecsTable specifications={machine.specifications} />
          <DetailList title="Applications" items={machine.applications} />

          <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
            <Link
              href={quoteHref}
              className="rounded-[0.7rem] bg-ink px-8 py-3 text-center text-sm font-bold uppercase tracking-wide text-surface transition-opacity hover:opacity-90"
            >
              Request a Quote
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[0.7rem] border border-ink/20 px-8 py-3 text-center text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink hover:text-accent"
            >
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
