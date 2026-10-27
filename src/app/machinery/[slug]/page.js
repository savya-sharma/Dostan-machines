import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { MACHINES, findMachineBySlug } from "@/data/machines";
import { getMachineWhatsAppLink } from "@/lib/whatsapp";

// Specs surfaced next to the title, in this order of preference — the
// ones a buyer scans for first. Falls back to the first few specs.
const KEY_SPEC_LABELS = [
  "Capacity",
  "Storage Capacity",
  "Power",
  "Power Supply",
  "Temperature Range",
  "Temperature",
  "Body Material",
  "Structure",
];
const KEY_SPEC_COUNT = 3;
const RELATED_COUNT = 3;

const pad = (n) => String(n).padStart(2, "0");

// Soft white stage for the transparent machine cut-outs.
const imageStageClasses =
  "relative overflow-hidden rounded-[1.25rem] bg-[radial-gradient(ellipse_at_center,#ffffff_35%,#ecece9_100%)]";

export function generateStaticParams() {
  return MACHINES.map((machine) => ({ slug: machine.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const machine = findMachineBySlug(slug);
  if (!machine) return { title: "Machine Not Found | Dostan Machines" };
  return { title: `${machine.name} | Dostan Machines` };
}

function getKeySpecs(specifications) {
  const picked = [];
  for (const label of KEY_SPEC_LABELS) {
    const spec = specifications.find((s) => s.label === label);
    if (spec) picked.push(spec);
    if (picked.length === KEY_SPEC_COUNT) return picked;
  }
  for (const spec of specifications) {
    if (picked.length === KEY_SPEC_COUNT) break;
    if (!picked.includes(spec)) picked.push(spec);
  }
  return picked;
}

// Two-column editorial row: numbered heading on the left (sticky on wide
// screens), content on the right.
function Section({ index, title, children }) {
  return (
    <section className="grid gap-6 border-t border-[#DDDDDD] pt-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <div className="flex flex-col gap-2 lg:sticky lg:top-[6.5rem] lg:self-start">
        <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent" aria-hidden="true">
          {index}
        </span>
        <h2 className="text-xl font-medium leading-tight tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function ItemList({ items }) {
  return (
    <ul className="border-t border-[#E6E6E3]">
      {items.map((item, i) => (
        <li
          key={item}
          className="flex gap-5 border-b border-[#E6E6E3] py-4 text-sm leading-relaxed sm:text-base"
        >
          <span className="pt-0.5 font-mono text-[0.7rem] tracking-wider text-ink/30 sm:pt-1">
            {pad(i + 1)}
          </span>
          <span className="text-ink/80">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SpecList({ specifications }) {
  return (
    <dl className="border-t border-[#E6E6E3]">
      {specifications.map((spec) => (
        <div
          key={spec.label}
          className="grid gap-1 border-b border-[#E6E6E3] py-4 text-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6 sm:text-base"
        >
          <dt className="text-ink/50">{spec.label}</dt>
          <dd className="font-medium text-ink sm:text-right">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function RelatedCard({ machine }) {
  return (
    <Link href={`/machinery/${machine.slug}`} className="group flex flex-col gap-4">
      <div className={`aspect-[4/3] ${imageStageClasses}`}>
        <ImageWithSkeleton
          src={machine.image}
          alt={machine.name}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">{machine.name}</p>
          {machine.purpose && (
            <p className="mt-1 text-xs leading-relaxed text-ink/50">{machine.purpose}</p>
          )}
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-ink/40 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>
    </Link>
  );
}

export default async function MachineDetailPage({ params }) {
  const { slug } = await params;
  const machine = findMachineBySlug(slug);
  if (!machine) notFound();

  const quoteHref = `/quotation?machine=${machine.slug}`;
  const whatsappHref = getMachineWhatsAppLink(machine.name);

  const position = MACHINES.findIndex((m) => m.slug === machine.slug);
  const keySpecs = getKeySpecs(machine.specifications);
  const related = Array.from(
    { length: Math.min(RELATED_COUNT, MACHINES.length - 1) },
    (_, i) => MACHINES[(position + i + 1) % MACHINES.length]
  );

  const sections = [
    { title: "Features", content: machine.features.length > 0 && <ItemList items={machine.features} /> },
    { title: "Highlights", content: machine.highlights.length > 0 && <ItemList items={machine.highlights} /> },
    {
      title: "Technical Specifications",
      content: machine.specifications.length > 0 && (
        <SpecList specifications={machine.specifications} />
      ),
    },
    { title: "Applications", content: machine.applications.length > 0 && <ItemList items={machine.applications} /> },
  ].filter((section) => section.content);

  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.8rem] text-ink/50">
        <Link
          href="/machinery"
          className="group flex items-center gap-1.5 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Machinery
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-ink" aria-current="page">
          {machine.name}
        </span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
        <div className={`aspect-square sm:aspect-[4/3] lg:aspect-square ${imageStageClasses}`}>
          <ImageWithSkeleton
            src={machine.image}
            alt={machine.name}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-contain p-8 sm:p-14"
          />
          <span className="absolute bottom-5 left-6 font-mono text-[0.7rem] tracking-[0.2em] text-ink/30">
            {pad(position + 1)} / {pad(MACHINES.length)}
          </span>
        </div>

        <div className="flex flex-col">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">
            Machinery
          </p>
          <h1 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {machine.name}
          </h1>
          {machine.purpose && (
            <p data-reveal className="mt-5 max-w-md text-base leading-relaxed text-ink/60">
              {machine.purpose}
            </p>
          )}

          {keySpecs.length > 0 && (
            <dl className="mt-10 border-t border-[#DDDDDD]">
              {keySpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-6 border-b border-[#DDDDDD] py-4 text-sm"
                >
                  <dt className="shrink-0 text-ink/50">{spec.label}</dt>
                  <dd className="text-right font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={quoteHref}
              className="group flex items-center justify-center gap-2.5 rounded-[0.7rem] bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-surface transition-colors duration-300 hover:bg-accent"
            >
              Request a Quote
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-[0.7rem] border border-ink/15 px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-colors duration-300 hover:border-ink hover:text-accent"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-16">
        {sections.length > 0 ? (
          sections.map((section, i) => (
            <Section key={section.title} index={pad(i + 1)} title={section.title}>
              {section.content}
            </Section>
          ))
        ) : (
          <Section index="01" title="Specifications">
            <p className="max-w-lg text-sm leading-relaxed text-ink/60 sm:text-base">
              Detailed specifications for this machine are shared on request.{" "}
              <Link
                href={quoteHref}
                className="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                Request a quote
              </Link>{" "}
              and our team will send them over.
            </p>
          </Section>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-28 border-t border-[#DDDDDD] pt-10">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-xl font-medium leading-tight tracking-tight sm:text-2xl">
              More Machinery
            </h2>
            <Link
              href="/machinery"
              className="group flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-accent"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-3">
            {related.map((m) => (
              <RelatedCard key={m.slug} machine={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
