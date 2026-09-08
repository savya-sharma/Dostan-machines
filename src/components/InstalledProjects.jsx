import { CornerDownRight } from "lucide-react";

const SMALL_CAPTIONS = [
  "From concept to completion, every installation is executed with reliable solutions tailored to each project's requirements.",
  "From concept to completion, every installation is executed with precision and purpose. We combine quality .",
  "From concept to completion, every installation is executed with precision and purpose. We combine quality craftsmanship",
];

const LARGE_CAPTION =
  "From concept to completion, every installation is executed with precision and purpose. We combine quality craftsmanship with reliable solutions tailored to each project's requirements.";

const VIDEOS = [
  "/videos/installed/video_01.mp4",
  "/videos/installed/video_02.mp4",
  "/videos/installed/video_3.mp4",
  "/videos/installed/video_4.mp4",
];

export default function InstalledProjects() {
  return (
    <div id="installed-projects" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
        Installed Projects
      </h1>

      <div className="mt-[3rem] flex flex-col gap-8 sm:flex-row sm:gap-16">
        <p className="text-sm text-justify opacity-70 sm:w-1/2">
          Our installed projects bring thoughtful design and reliable
          engineering together to create spaces built for everyday
          performance. Each installation is planned with precision, from the
          initial concept to the final execution. We focus on quality
          materials, seamless integration, and practical functionality. Every
          project is tailored to meet the specific requirements of its
          environment. With attention to detail at every stage, we ensure a
          refined and dependable result. Explore our completed installations
          and discover the standard we bring to every project.
        </p>
        <p className="text-sm text-justify opacity-70 sm:w-1/2">
          From concept to completion, every installation is executed with
          precision and purpose. We combine quality craftsmanship with
          reliable solutions tailored to each project's requirements. Explore
          our installed projects and see how we turn ideas into functional,
          lasting results.
        </p>
      </div>

      <div className="mt-[4rem] grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {SMALL_CAPTIONS.map((caption, index) => (
          <div key={index}>
            <div className="aspect-square bg-white"></div>
            <p className="mt-3 text-xs text-justify opacity-70">{caption}</p>
          </div>
        ))}
      </div>

      <div className="mt-[4rem] grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
        <div>
          <div className="aspect-square bg-white"></div>
          <p className="mt-3 text-xs text-justify opacity-70">
            {LARGE_CAPTION}
          </p>
        </div>
        <div>
          <div className="aspect-square bg-white"></div>
          <p className="mt-3 text-xs text-justify text-right opacity-70">
            {LARGE_CAPTION}
          </p>
        </div>
      </div>

      <div className="mt-[4rem] flex justify-center">
        <a
          className="flex items-center gap-[0.4rem] text-sm font-medium transition-colors hover:text-accent"
          href="#installed-projects"
        >
          View all projects <CornerDownRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-[4rem] grid grid-cols-1 gap-6 sm:grid-cols-3">
        {VIDEOS.map((src) => (
          <video
            key={src}
            className="aspect-square w-full bg-gray-300 object-cover"
            src={src}
            autoPlay
            loop
            muted
            playsInline
          />
        ))}
      </div>
    </div>
  );
}
