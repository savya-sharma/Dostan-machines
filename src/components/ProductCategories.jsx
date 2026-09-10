import { CornerDownRight } from "lucide-react";
import ImageWithSkeleton from "./ImageWithSkeleton";

const CATEGORY_ITEMS = [
  { name: "Cooling tower", image: "/images/machines/COOLING-TOWER-MACHINE.webp" },
  { name: "Plate Heat Exchanger", image: "/images/machines/PLATE-HEAT-EXCHANGER-MACHINE.webp" },
  null,
  { name: "Pasteurizer Tank", image: "/images/machines/PASTEURIZER-TANK-MACHINE.webp" },
];

const DESCRIPTION_PARAGRAPHS = [
  "DOSTAN offers a comprehensive range of processing and production machinery engineered for demanding industrial environments. Our equipment supports efficient, hygienic, and consistent production across dairy, ice cream, food, beverage, and related applications. From individual processing units to integrated production systems, every machine is developed with precision and reliability in mind.",
  "Our range includes pasteurizers, homogenizers, continuous freezers, cooling systems, pumps, filtration equipment, and specialized machinery. Each solution can be configured around specific production capacities, process requirements, and facility layouts. Built with robust construction and practical engineering, DOSTAN machines deliver reliable performance for continuous production.",
];

const LINES = [
  {
    title: "Planning commercial\ncup production.",
    description:
      "Explore machinery for mix preparation, continuous freezing, automatic filling, hardening and cold storage.",
    image: "/images/machines/CUP-ICE-CREAM-MACHINE.webp",
    aspect: "1899/828",
  },
  {
    title: "Planning commercial\ncone ice cream.",
    description:
      "From freezing to automatic cone filling and hardening, plan a production line around your required output.",
    image: "/images/machines/CONE-ICE-CREAM-MACHINE.webp",
    aspect: "1774/887",
  },
];

export default function ProductCategories() {
  return (
    <div id="product-categories" className="px-[2rem] py-[6rem]">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
          Product Categories
        </h1>
        <p className="text-lg text-right leading-relaxed opacity-70 sm:max-w-md">
          Explore DOSTAN&apos;s range of processing and production machinery,
          engineered for efficient, hygienic, and reliable performance
          across diverse food manufacturing applications.
        </p>
      </div>

      <div className="mt-[3rem] grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORY_ITEMS.map((item, index) =>
          item ? (
            <div key={item.name}>
              <div className="relative aspect-square bg-line">
                <ImageWithSkeleton
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-xs opacity-70">{item.name}</p>
            </div>
          ) : (
            <div key={`empty-${index}`} />
          )
        )}
      </div>

      <div className="mt-[4rem] grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-6">
          {DESCRIPTION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph} className="text-sm text-justify opacity-70">
              {paragraph}
            </p>
          ))}
        </div>

        <div>
          <div className="relative aspect-[7/8] bg-line">
            <ImageWithSkeleton
              src="/images/machines/HARDENING-TUNNEL-MACHINE.webp"
              alt="Hardening tunnel"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-xs opacity-70">Hardening tunnel</p>
        </div>
      </div>

      <div className="mt-[4rem] flex flex-col gap-[4rem]">
        {LINES.map((line) => (
          <div key={line.title} className="grid items-center gap-8 sm:grid-cols-2">
            <div
              className="relative w-full bg-line"
              style={{ aspectRatio: line.aspect }}
            >
              <ImageWithSkeleton
                src={line.image}
                alt={line.title.replace(/\n/g, " ")}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="whitespace-pre-line text-xl leading-tight sm:text-2xl">
                {line.title}
              </h2>
              <p className="mt-[1rem] text-sm opacity-70">
                {line.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[4rem] flex justify-center">
        <a
          className="flex items-center gap-[0.4rem] text-sm font-medium text-accent transition-[gap,opacity] hover:gap-[0.6rem] hover:opacity-70"
          href="/machinery"
        >
          View All Products <CornerDownRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
