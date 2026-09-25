import ImageWithSkeleton from "./ImageWithSkeleton";

export default function FactoryManufacturing() {
  return (
    <div id="factory-manufacturing" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        Factory &amp; Manufacturing
      </h1>
      <div className="mt-[2rem] flex flex-col gap-6 sm:flex-row sm:gap-16">
        <p className="text-xs text-justify sm:w-1/2">
          Our manufacturing facilities bring engineering and fabrication
          together under one roof, enabling greater control over machinery
          development, assembly, and finishing.
        </p>
        <p className="text-xs text-justify opacity-70 sm:w-1/2">
          From individual equipment to integrated production systems, every
          machine is built around practical production requirements, with
          attention to construction, functionality, and installation readiness.
        </p>
      </div>

      <div className="mt-[3rem] grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* left column */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[9/10] bg-line">
            <ImageWithSkeleton
              src="/images/factory/FACTORY-IMG-01.webp"
              alt="Factory floor"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="relative mt-[3rem] aspect-[3/2] bg-line">
            <ImageWithSkeleton
              src="/images/machines/GALLERY-03.webp"
              alt="Ageing vat"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-6 sm:mt-[6rem]">
          <div className="relative aspect-[9/10] w-1/2 bg-line">
            <ImageWithSkeleton
              src="/images/machines/GALLERY-23.webp"
              alt="Pasteurizer vat"
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
