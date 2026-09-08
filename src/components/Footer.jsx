export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-cover bg-center px-[2rem] pt-[6rem] text-white"
      style={{ backgroundImage: "url(/images/background/footerbg.webp)" }}
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <a href="#" className="text-sm transition-colors hover:text-accent">Solutions</a>
            <a href="#" className="text-sm transition-colors hover:text-accent">Machinery</a>
            <a href="#" className="text-sm transition-colors hover:text-accent">Projects</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-sm transition-colors hover:text-accent">About</a>
            <a href="#" className="text-sm transition-colors hover:text-accent">Insights</a>
            <a href="#" className="text-sm transition-colors hover:text-accent">Contact</a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center text-sm font-semibold">
          DOSTAN
          <p className="max-w-xs font-normal">
            DOSTAN engineers reliable machinery and complete production
            solutions—built for precision and performance.
          </p>
        </div>

        <div className="text-sm">Social Icons</div>
      </div>

      <div className="mt-[6rem] -mx-[2rem] flex h-[8vw] items-start justify-center overflow-hidden px-4">
        <h2 className="whitespace-nowrap text-[9vw] font-bold leading-none tracking-tight">
          DOSTAN MACHINES
        </h2>
      </div>
    </footer>
  );
}
