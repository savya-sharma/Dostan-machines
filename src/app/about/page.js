import Image from "next/image";

export const metadata = {
  title: "About | Dostan Machines",
};

export default function AboutPage() {
  return (
    <div className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        About Us
      </h1>

      <div className="mt-[3rem] max-w-2xl">
        <h2 className="text-base font-semibold sm:text-lg">
          The Cornerstones of DOSTAN MACHINES LLP
        </h2>
        <p className="mt-3 text-justify text-sm leading-[1.8] text-ink/70 sm:text-base">
          At DOSTAN MACHINES LLP,{" "}
          <span className="text-accent">quality and trust</span> are the
          foundation of everything we do. We manufacture state-of-the-art
          ice cream machinery that adheres to the highest international
          standards, ensuring unmatched durability, precision, and
          efficiency for each of our clients. Our equipment is meticulously
          engineered to deliver top-tier performance while prioritizing
          hygiene and safety, giving you the confidence you deserve.
        </p>

        <p className="mt-6 text-justify text-sm leading-[1.8] text-ink/70 sm:text-base">
          When you choose DOSTAN, you&apos;re not just investing in advanced
          technology; you&apos;re forging a partnership with a company that
          provides{" "}
          <span className="text-accent">complete turnkey solutions</span>{" "}
          for your ice cream business. From machinery installation to
          product launch, we handle every aspect, allowing you to focus on
          what matters most&mdash;growing your business. Our commitment
          extends beyond the machinery; we are with you every step of the
          way, dedicated to ensuring your success with every scoop.
        </p>

        <h2 className="mt-6 text-base font-semibold sm:text-lg">
          Let&apos;s Build Something Sweet Together!
        </h2>
        <p className="mt-3 text-justify text-sm leading-[1.8] text-ink/70 sm:text-base">
          Join us on a journey to discover the perfect solutions for your
          business. With DOSTAN, you&apos;re choosing a partner who upholds{" "}
          <span className="text-accent">
            quality, trust, and excellence
          </span>{" "}
          with integrity, transparency, and long-lasting relationships.
          Whether you&apos;re just starting or scaling up, we&apos;re here
          to support you at every turn&mdash;because your success is our
          success.
        </p>
      </div>

      <div className="mt-[5rem] flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-16">
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
        </div>

        <p className="max-w-2xl indent-10 text-justify text-sm leading-[1.8] sm:text-base">
          Founded in{" "}
          <span className="text-accent">
            2024 by Mr. Kapil Sharma, Dostan Machines was established with a
            clear vision to provide reliable, high-quality machinery
            solutions for the ice cream manufacturing industry.
          </span>{" "}
          Driven by his entrepreneurial vision and commitment to excellence,
          Mr. Kapil Sharma has built the company with a strong focus on
          innovation, precision engineering, quality, and customer
          satisfaction. Today, Dostan Machines is dedicated to providing
          efficient and dependable machinery solutions that help ice cream
          manufacturers improve their production capabilities and achieve
          consistent quality. Our commitment is to grow alongside our
          customers by delivering trusted products, professional service,
          and long-term value.
        </p>
      </div>
    </div>
  );
}
