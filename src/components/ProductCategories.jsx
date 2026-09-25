import Link from "next/link";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { CornerDownRight } from "lucide-react";
import { findMachineByImage } from "@/data/machines";

// The first six gallery photos, in file order. Each card's name, purpose,
// and link are looked up from the catalog by this image (never
// hardcoded), so the label and the single-product page it opens always
// describe the same machine as the photo.
const CATEGORY_IMAGES = [
  "/images/machines/GALLERY-01.webp",
  "/images/machines/GALLERY-02.webp",
  "/images/machines/GALLERY-03.webp",
  "/images/machines/GALLERY-04.webp",
  "/images/machines/GALLERY-05.webp",
  "/images/machines/GALLERY-06.webp",
];

function CategoryCard({ image }) {
  // The card's name, purpose, and link always come from whichever machine
  // actually owns this photo in the catalog — never hardcoded — so this
  // card and the page its View button opens can never disagree about
  // identity.
  const matchedMachine = findMachineByImage(image);
  const Wrapper = matchedMachine ? Link : "div";
  const wrapperProps = matchedMachine
    ? { href: `/machinery/${matchedMachine.slug}` }
    : {};
  const name = matchedMachine?.name ?? "Dostan Machine";

  return (
    <Wrapper {...wrapperProps}>
      <div className="group relative aspect-[3/2] bg-line">
        <ImageWithSkeleton
          src={image}
          alt={name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 ease-out group-hover:opacity-100">
          <span className="text-sm font-bold uppercase tracking-wide text-surface">
            View
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-6">
        <p className="shrink-0 text-xs">{name}</p>
        <p className="max-w-[70%] text-justify text-xs opacity-70">
          {matchedMachine?.purpose}
        </p>
      </div>
    </Wrapper>
  );
}

export default function ProductCategories() {
  return (
    <div id="product-categories" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        Product Categories
      </h1>

      <div className="mt-[3rem] grid grid-cols-1 gap-x-4 gap-y-[3rem] sm:grid-cols-2">
        {CATEGORY_IMAGES.map((image) => (
          <CategoryCard key={image} image={image} />
        ))}
      </div>

      <div className="mt-[4rem] flex justify-center">
        <Link
          className="flex items-center gap-[0.4rem] text-sm font-medium text-accent transition-[gap,opacity] hover:gap-[0.6rem] hover:opacity-70"
          href="/machinery"
        >
          View All Machines <CornerDownRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
