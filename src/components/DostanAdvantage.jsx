import Image from "next/image";
import { CornerDownRight } from "lucide-react";

export default function DostanAdvantage() {
  return (
    <div id="dostan-advantage" className="px-[2rem] py-[6rem]">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">Why Dostan Machines</h1>
        <p className="mt-[2rem] max-w-2xl text-justify text-[1.5rem] leading-[2rem] opacity-70 tracking-tight">
          We bring strategy, design, and technology together to create digital experiences that feel distinctive and purposeful. Every project is shaped around clarity, character, and a strong visual point of view, and give brands a presence that stays memorable long after the first interaction.
        </p>
        <div className="mt-[1.5rem] flex max-w-2xl justify-end">
          <a
            className="flex items-center gap-[0.4rem] text-sm font-medium transition-colors hover:text-accent"
            href="#"
          >
            About Dostan <CornerDownRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-[5rem] flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
        <Image
          src="/logos/logo-02.svg"
          alt="Dostan Machines logo mark"
          width={80}
          height={69}
          className="h-24 w-auto shrink-0 sm:h-32 lg:h-[12rem]"
        />

        <p className="max-w-sm text-justify text-sm leading-relaxed opacity-70 tracking-tight">
          We create identities and digital experiences that give brands a distinctive voice in crowded spaces. Through thoughtful design and purposeful technology, we turn complex ideas into something simple, engaging, and memorable.
        </p>
      </div>
    </div>
  )
}
