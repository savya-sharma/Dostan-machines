const CAPTION =
  "We create digital experiences for factories, manufacturers, and industrial brands that need to communicate complex products with clarity. From product presentation to digital catalogues, we turn technical information into engaging brand experiences.";

const STEPS = {
  step01: {
    number: "01 Discovery",
    description: "Understanding your production goals, product type, and capacity.",
  },
  step02: {
    number: "02 Engineering Design",
    description: "Planning machinery layout and process flow.",
  },
  step03: {
    number: "03 Manufacturing",
    description: "Precision fabrication using food-grade materials.",
  },
  step04: {
    number: "04 Installation & Commissioning",
    description: "Operator guidance until successful production.",
  },
  step05: {
    number: "05 Training & Launch Support",
    description: "Operator guidance until successful production.",
  },
};

function Step({ step }) {
  return (
    <div>
      <h2>{step.number}</h2>
      <p className="mt-2 text-sm">{step.description}</p>
    </div>
  );
}

function Caption() {
  return <p className="text-xs text-justify opacity-70">{CAPTION}</p>;
}

export default function FactoryManufacturing() {
  return (
    <div id="factory-manufacturing" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
        Factory &amp; Manufacturing
      </h1>

      <div className="mt-[3rem] grid grid-cols-1 gap-8 sm:grid-cols-2">
        <p className="text-xs text-justify opacity-70 sm:w-3/4">
          We create digital experiences that bring manufacturing brands into
          the modern world. From industrial websites to product showcases,
          we combine clear communication with purposeful design. Every
          detail is built to make complex products easier to understand and
          remember.
        </p>
      </div>

      <div className="mt-[3rem] grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* left column */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[4/5] bg-white"></div>
          <Caption />

          <div className="mt-6">
            <Step step={STEPS.step02} />
          </div>

          <div className="aspect-[4/3] bg-white"></div>

          <Step step={STEPS.step03} />

          <div className="mt-16">
            <Step step={STEPS.step04} />
          </div>

          <div className="aspect-[16/9] bg-white"></div>

          <Step step={STEPS.step05} />
        </div>

        {/* right column */}
        <div className="flex flex-col gap-6">
          <Step step={STEPS.step01} />

          <div className="aspect-[4/5] w-1/2 bg-white"></div>

          <div className="mt-16">
            <div className="aspect-[16/10] bg-white"></div>
            <div className="mt-6">
              <Caption />
            </div>
          </div>

          <div className="mt-6">
            <div className="aspect-[12/5] bg-white"></div>
            <div className="mt-6">
              <Caption />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
