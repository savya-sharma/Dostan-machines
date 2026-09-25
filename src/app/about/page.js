import Image from "next/image";

export const metadata = {
  title: "About | Dostan Machines",
};

export default function AboutPage() {
  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        About Us
      </h1>

      <div className="mt-[3rem] max-w-2xl">
        <h2 className="text-base font-semibold sm:text-lg">
          The Cornerstones of DOSTAN MACHINES
        </h2>
        <p className="mt-3 text-justify text-sm leading-[1.8] text-ink/70 sm:text-base">
          At DOSTAN MACHINES, we focus on manufacturing{" "}
          <span className="text-accent">
            machinery and processing solutions
          </span>{" "}
          for the ice cream and food-processing industry. Our work covers
          individual machinery as well as complete production requirements,
          with engineering, manufacturing, installation, service, and
          after-sales support integrated into the process.
        </p>

        <p className="mt-6 text-justify text-sm leading-[1.8] text-ink/70 sm:text-base">
          We work closely with customers to understand their production
          requirements and provide machinery suited to their{" "}
          <span className="text-accent">
            specific applications, capacity, and plant requirements
          </span>
          .
        </p>

        <h2 className="mt-6 text-base font-semibold sm:text-lg">
          Your Production. Our Expertise.
        </h2>
        <p className="mt-3 text-justify text-sm leading-[1.8] text-ink/70 sm:text-base">
          Whether you are setting up a new ice cream production facility or
          expanding an existing operation, DOSTAN MACHINES works with you
          across the machinery and plant setup process&mdash;from{" "}
          <span className="text-accent">
            equipment selection and manufacturing to installation and
            ongoing technical support
          </span>
          .
        </p>
      </div>

      <div className="mt-[5rem] flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-12">
        <div className="w-full max-w-[220px] shrink-0 sm:max-w-xs">
          <div className="relative aspect-[3/4] w-full bg-line">
            <Image
              src="/images/about/kapil-sharma.webp"
              alt="Mr Kapil Sharma"
              fill
              sizes="(min-width: 640px) 25vw, 60vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-sm font-medium">Mr Kapil Sharma</p>
          <p className="text-xs text-ink/60">Founder &amp; CEO, DOSTAN MACHINES</p>
        </div>

        <p className="max-w-2xl indent-10 text-justify text-sm leading-[1.8] sm:text-base">
          Founded in{" "}
          <span className="text-accent">
            2024 by Mr. Kapil Sharma, Founder &amp; CEO, DOSTAN MACHINES was
            established to manufacture and supply machinery for the ice
            cream manufacturing industry.
          </span>{" "}
          The company operates from Factory Nos. 181 and 188, with a focus
          on machinery manufacturing and engineering. DOSTAN MACHINES
          equipment is installed across India and international markets,
          serving customers with machinery, installation, service, and
          after-sales support.
        </p>
      </div>
    </div>
  );
}
