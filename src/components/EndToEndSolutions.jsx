import { CornerDownRight } from "lucide-react";

const SPEC_LIST = [
  "High-grade industrial materials",
  "Industrial & commercial use",
  "Precision-engineered",
  "High efficiency & reliable operation",
  "Designed for long-term service",
];

const PRODUCTS = [
  {
    title: "High pressure homogenizer",
    description:
      "Our High Pressure Homogenizers ensure uniform mixing, improved texture, and enhanced product stability by reducing particle size through high-pressure processing. Ideal for dairy, ice cream, beverage, and food processing applications.",
    imageSide: "left",
  },
  {
    title: "Continuous freezer",
    description:
      "Continuous Freezers are advanced ice cream processing machines designed to deliver consistent texture, smoothness, and controlled overrun during continuous production. They ensure high efficiency, superior product quality, and increased output capacity.",
    imageSide: "right",
  },
  {
    title: "Cooling Tower",
    description:
      "Cooling Towers are designed to efficiently dissipate heat from industrial processes, ensuring optimal equipment performance, reduced energy consumption, and reliable cooling for dairy, ice cream, and food processing plants. End-to-end automated and semi-automated ice cream manufacturing systems including mix preparation, pasteurization, homogenization, aging, freezing, filling, and hardening.",
    imageSide: "left",
  },
  {
    title: "Plate heat exchanger",
    description:
      "Plate Heat Exchangers are highly efficient thermal systems designed for rapid heating and cooling of dairy, food, and beverage products. They ensure optimal heat transfer, energy savings, and consistent product quality.",
    imageSide: "right",
  },
  {
    title: "Pasteurizer Tank",
    description:
      "Pasteurizer Tanks are designed for efficient heat treatment of milk, cream, and other liquid products, ensuring food safety, extended shelf life, and consistent product quality while maintaining nutritional value.",
    imageSide: "left",
  },
];

export default function EndToEndSolutions() {
  return (
    <div id="end-to-end-solutions" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">End To End Solution</h1>

      <div className="mt-[3rem] flex flex-col gap-8 sm:flex-row sm:gap-16">
        <div className="sm:w-1/2">
          <h2>Engineered for Quality</h2>
          <p className="mt-[1rem] text-sm text-justify opacity-70">
            Precision-engineered systems built with food-grade materials and
            rigorous quality standards for hygienic, consistent performance.
          </p>
        </div>
        <div className="sm:w-1/2">
          <h2>Built for Reliability</h2>
          <p className="mt-[1rem] text-sm text-justify opacity-70">
            Robust machinery designed for continuous operation, long-term
            durability, and dependable performance in demanding production
            environments
          </p>
        </div>
      </div>

      <div className="mt-[4rem] flex flex-col gap-8 sm:flex-row sm:gap-8">
        <div className="bg-white sm:w-1/2 aspect-[4/3]"></div>

        <div className="sm:w-1/2">
          <h2>Description</h2>
          <p className="mt-[1rem] text-sm text-justify opacity-70">
            Our product range is designed to deliver dependable performance,
            precision, and long-term reliability across diverse applications.
            Each solution is developed with careful attention to material
            quality, engineering standards, and practical functionality. We
            combine modern manufacturing practices with proven expertise to
            create products that perform consistently in demanding
            environments.
          </p>

          <h2 className="mt-[1.5rem]">Specifications</h2>
          <div className="mt-[1rem] flex gap-8">
            <ul className="text-sm opacity-70">
              {SPEC_LIST.map((item) => (
                <li key={`spec-a-${item}`}>{item}</li>
              ))}
            </ul>
            <ul className="text-sm opacity-70">
              {SPEC_LIST.map((item) => (
                <li key={`spec-b-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-[5rem] flex flex-col gap-[5rem]">
        {PRODUCTS.map((product) => (
          <div
            key={product.title}
            className={`flex flex-col gap-8 sm:gap-8 ${
              product.imageSide === "left" ? "sm:flex-row" : "sm:flex-row-reverse"
            }`}
          >
            <div className="bg-white sm:w-1/2 aspect-[4/3]"></div>
            <div
              className={`sm:w-1/2 flex flex-col justify-center ${
                product.imageSide === "left" ? "text-left" : "text-right"
              }`}
            >
              <h2>{product.title}</h2>
              <p className="mt-[1rem] text-sm opacity-70">
                {product.description}
              </p>
            </div>
          </div>
        ))}
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
