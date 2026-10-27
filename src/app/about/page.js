import Image from "next/image";

export const metadata = {
  title: "About | Dostan Machines",
};

// Two-column editorial row: heading on the left (sticky on wide screens),
// copy on the right — the same rhythm as the machine detail pages.
function Section({ title, children }) {
  return (
    <section className="grid gap-6 border-t border-[#DDDDDD] pt-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <h2 className="text-xl font-medium leading-tight tracking-tight sm:text-2xl lg:sticky lg:top-[6.5rem] lg:self-start">
        {title}
      </h2>
      <div className="flex max-w-3xl flex-col gap-6">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="px-[2rem] pt-[6.5rem] pb-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        About Us
      </h1>

      <div className="mt-16 flex flex-col gap-20 sm:mt-20">
        <Section title="The Cornerstones of DOSTAN MACHINES">
          <p data-reveal className="text-lg leading-relaxed tracking-tight text-ink/80 sm:text-xl">
            At DOSTAN MACHINES, we focus on manufacturing{" "}
            <span className="text-accent">
              machinery and processing solutions
            </span>{" "}
            for the ice cream and food-processing industry. Our work covers
            individual machinery as well as complete production requirements,
            with engineering, manufacturing, installation, service, and
            after-sales support integrated into the process.
          </p>
          <p className="text-sm leading-[1.8] text-ink/60 sm:text-base">
            We work closely with customers to understand their production
            requirements and provide machinery suited to their{" "}
            <span className="text-accent">
              specific applications, capacity, and plant requirements
            </span>
            .
          </p>
        </Section>

        <Section title="Your Production. Our Expertise.">
          <p data-reveal className="text-lg leading-relaxed tracking-tight text-ink/80 sm:text-xl">
            Whether you are setting up a new ice cream production facility or
            expanding an existing operation, DOSTAN MACHINES works with you
            across the machinery and plant setup process&mdash;from{" "}
            <span className="text-accent">
              equipment selection and manufacturing to installation and
              ongoing technical support
            </span>
            .
          </p>
        </Section>

        <section className="grid gap-10 border-t border-[#DDDDDD] pt-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <figure className="w-full max-w-[260px] sm:max-w-xs">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-line/40">
              <Image
                src="/images/about/kapil-sharma.webp"
                alt="Mr Kapil Sharma"
                fill
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 20rem, 260px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4">
              <p className="text-sm font-medium">Mr Kapil Sharma</p>
              <p className="mt-0.5 text-xs text-ink/50">
                Founder &amp; CEO, DOSTAN MACHINES
              </p>
            </figcaption>
          </figure>

          <p data-reveal className="max-w-3xl self-center text-xl leading-snug tracking-tight text-ink/80 sm:text-2xl lg:text-[1.75rem] lg:leading-[1.35]">
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
        </section>
      </div>
    </div>
  );
}
