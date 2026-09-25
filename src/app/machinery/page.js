import Link from "next/link";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { MACHINES } from "@/data/machines";

export const metadata = {
  title: "Machinery | Dostan Machines",
};

// Renders every machine in the centralized catalog, in GALLERY-NN.webp
// image order — the grid is a direct view of MACHINES rather than a
// separately maintained caption list, so a card's name/purpose/link can
// never drift out of sync with its own detail page again.
function galleryNumber(machine) {
  return parseInt(machine.image.match(/GALLERY-(\d+)/)[1], 10);
}

const MACHINE_IMAGES = [...MACHINES].sort(
  (a, b) => galleryNumber(a) - galleryNumber(b)
);

function MachineCard({ machine }) {
  return (
    <Link href={`/machinery/${machine.slug}`}>
      <div className="group relative aspect-[3/2] bg-line">
        <ImageWithSkeleton
          src={machine.image}
          alt={machine.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 ease-out group-hover:opacity-100">
          <span className="text-sm font-bold uppercase tracking-wide text-surface">
            View
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-6">
        <p className="shrink-0 text-xs">{machine.name}</p>
        <p className="max-w-[70%] text-justify text-xs opacity-70">
          {machine.purpose}
        </p>
      </div>
    </Link>
  );
}

export default function MachineryPage() {
  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
          Machinery
        </h1>
        <p className="max-w-xs text-xs opacity-70 sm:text-right">
          Explore DOSTAN&apos;s range of processing and production machinery,
          engineered for efficient, hygienic, and reliable performance across
          diverse food manufacturing applications.
        </p>
      </div>

      <div className="mt-[4rem] grid grid-cols-1 gap-x-4 gap-y-[3rem] sm:grid-cols-2">
        {MACHINE_IMAGES.map((machine) => (
          <MachineCard key={machine.slug} machine={machine} />
        ))}
      </div>
    </div>
  );
}
