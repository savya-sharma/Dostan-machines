import ImageWithSkeleton from "./ImageWithSkeleton";

export default function FactoryManufacturing() {
  return (
    <div id="factory-manufacturing" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        Factory &amp; Manufacturing
      </h1>
      <p className="mt-[2rem] max-w-sm text-xs text-justify">
        DOSTAN&apos;s manufacturing facility brings engineering expertise,
        precision fabrication, and rigorous quality standards together under
        one roof. From individual components to complete processing
        machinery, every system is manufactured with attention to detail and
        built for demanding industrial environments.
      </p>

      <div className="mt-[3rem] grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* left column */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[9/10] bg-line">
            <ImageWithSkeleton
              src="/images/machines/FACTORY-IMG-01.webp"
              alt="Factory floor"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="max-w-xs text-xs text-justify opacity-70">
            Food-grade materials and carefully engineered designs support
            hygienic production and reliable operation across processing
            environments.
          </p>

          <div className="relative mt-[3rem] aspect-[3/2] bg-line">
            <ImageWithSkeleton
              src="/images/machines/AGEING-VAT-MAHINCE.webp"
              alt="Ageing vat"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </div>

          <p className="mt-[10rem] max-w-xs text-xs text-justify opacity-70">
            Robust construction and practical engineering create machinery
            designed to perform consistently under demanding production
            conditions.
          </p>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-6 sm:mt-[6rem]">
          <p className="max-w-xs text-xs text-justify">
            Advanced fabrication and skilled workmanship ensure every machine
            is built with accuracy, consistency, and structural integrity.
          </p>
          <div className="relative aspect-[9/10] w-1/2 bg-line">
            <ImageWithSkeleton
              src="/images/machines/PASTEURIZER-VAN-MACHINE.webp"
              alt="Pasteurizer vat"
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-contain"
            />
          </div>

          <p className="mt-[3rem] max-w-sm text-xs text-justify opacity-70">
            Every stage of manufacturing is closely monitored to maintain
            dimensional accuracy, finish quality, and dependable machine
            performance.
          </p>
        </div>
      </div>
    </div>
  );
}
