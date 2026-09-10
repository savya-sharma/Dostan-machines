import fs from "fs";
import path from "path";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

export const metadata = {
  title: "Machinery | Dostan Machines",
};

// Captions given for the current 21 images, in sequence. "leave" means no
// caption for that slot.
const CAPTIONS = [
  "High Pressure Homogenizer",
  "leave",
  "Ageing Tank",
  "Cooling Tower",
  "Ice Candy Making Machine",
  "Servo HMI Pouch Packing Machine",
  "leave",
  "Cup & Cone Filling",
  "Fruit Feeder",
  "Deep Freezer Type Hardener",
  "Hardening Tunnel",
  "Cold Room & Blast Room",
  "Refrigerated Van & TDU",
  "SS Mold of Kulfi & Chocobar",  
  "Flavour Tank",
  "Fow/Truck/E-Rickshaw",
  "Glycol Fow Freezer",
  "Plate Heat Exchanger",
  "Milk Pump & Filter",
  "Chocolate & Defrost Tank",
  "Continuous Freezer",
];

function getMachineImages() {
  const dir = path.join(process.cwd(), "public/images/machines");
  const files = fs
    .readdirSync(dir)
    .filter((file) => /^DOSTAN-MACHINE-\d+\.webp$/i.test(file));

  files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numA - numB || a.localeCompare(b);
  });

  return files.map((file, index) => {
    const caption = CAPTIONS[index];
    const name =
      caption && caption.toLowerCase() !== "leave"
        ? caption
        : `Dostan Machine ${index + 1}`;
    return {
      name,
      caption: caption && caption.toLowerCase() !== "leave" ? caption : null,
      src: `/images/machines/${file}`,
    };
  });
}

// Alternates rows of 3 and 2 images, in sequence, across however many
// images are currently in public/images/machines/ (DOSTAN-MACHINE-*.webp).
function buildSections(images) {
  const sections = [];
  let cursor = 0;
  let wantsTriple = true;
  while (cursor < images.length) {
    const size = Math.min(wantsTriple ? 3 : 2, images.length - cursor);
    sections.push(images.slice(cursor, cursor + size));
    cursor += size;
    wantsTriple = !wantsTriple;
  }
  return sections;
}

const MACHINE_IMAGES = getMachineImages();
const SECTIONS = buildSections(MACHINE_IMAGES);

export default function MachineryPage() {
  return (
    <div className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
        Machinery
      </h1>
      <p className="mt-4 text-lg opacity-70">
        Engineered equipment for modern dairy &amp; food processing.
      </p>

      <div className="mt-[4rem] flex flex-col gap-[5rem]">
        {SECTIONS.map((images, index) => {
          const cols = images.length;
          return (
            <div
              key={index}
              className="grid grid-cols-1 gap-3"
              style={{
                gridTemplateColumns:
                  cols > 1 ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
              }}
            >
              {images.map((machine) => (
                <div key={machine.src}>
                  <div className="relative aspect-[3/2] bg-line">
                    <ImageWithSkeleton
                      src={machine.src}
                      alt={machine.name}
                      fill
                      sizes={
                        cols === 1
                          ? "100vw"
                          : cols === 3
                          ? "(min-width: 640px) 33vw, 100vw"
                          : "(min-width: 640px) 50vw, 100vw"
                      }
                      className="object-cover"
                    />
                  </div>
                  {machine.caption && (
                    <p className="mt-2 text-xs opacity-70">
                      {machine.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
