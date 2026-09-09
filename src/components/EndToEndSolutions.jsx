import Image from "next/image";
import { CornerDownRight } from "lucide-react";

const FEATURES = [
  {
    title: "Build For Reliability",
    description:
      "Robust machinery designed for consistent performance and continuous production.",
  },
  {
    title: "Tailored To Your Process",
    description:
      "Solutions developed around your product, capacity, layout, and specific production requirements.",
  },
  {
    title: "Turnkey Execution",
    description:
      "From initial planning to installation, commissioning, and operator support—we manage the complete execution.",
  },
  {
    title: "Scalable Production",
    description:
      "Systems designed to support your current operation while allowing room for future expansion.",
  },
  {
    title: "Technical Expertise",
    description:
      "Engineering knowledge and practical experience that turn complex production requirements into workable solutions.",
  },
];

const STRIP_IMAGES = [
  {
    name: "Pasteurizer Tank",
    image: "/images/machines/PASTEURIZER-TANK-MACHINE.webp",
    aspect: "aspect-[508/510]",
  },
  {
    name: "Cooling tower",
    image: "/images/machines/COOLING-TOWER-MACHINE.webp",
    aspect: "aspect-[415/510]",
  },
  {
    name: "Plate Heat Exchanger",
    image: "/images/machines/PLATE-HEAT-EXCHANGER-MACHINE.webp",
    aspect: "aspect-[277/510]",
  },
];

export default function EndToEndSolutions() {
  return (
    <div id="end-to-end-solutions" className="px-[2rem] py-[6rem]">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
          End To End Solution
        </h1>
        <p className="text-lg text-right leading-relaxed opacity-70 sm:max-w-md">
          From individual machines to complete processing systems, DOSTAN
          delivers engineered solutions designed around your production
          requirements.
        </p>
      </div>

      <div className="mt-[3rem] grid gap-8 sm:grid-cols-2">
        <div>
          <div className="relative aspect-[5/3] bg-line">
            <Image
              src="/images/machines/High-PRESSURE-HOMOGENIZER-MACHINE.webp"
              alt="High pressure homogenizer"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </div>

          <div className="mt-[3rem] flex flex-col gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title}>
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-1 text-sm opacity-70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[3/4] bg-line sm:mt-[6rem]">
          <Image
            src="/images/machines/DM-Dostan.webp"
            alt="Continuous freezer"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-[5rem] grid grid-cols-[1.85fr_1.5fr_1fr]">
        {STRIP_IMAGES.map((item) => (
          <div key={item.name} className={`relative bg-line ${item.aspect}`}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="40vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <div className="mt-[3rem] grid gap-8 sm:grid-cols-2">
        <p className="text-sm opacity-70">
          Every solution is designed around your process, production
          capacity, facility, and operational requirements—ensuring the
          right equipment for the job.
        </p>
        <p className="text-sm text-justify opacity-70">
          From precision manufacturing to installation and commissioning,
          every stage is focused on delivering reliable performance,
          efficiency, and lasting value.
        </p>
      </div>

      <div className="mt-[3rem] flex justify-center">
        <a
          className="flex items-center gap-[0.4rem] text-sm font-medium transition-colors hover:text-accent"
          href="#end-to-end-solutions"
        >
          View All Products <CornerDownRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
