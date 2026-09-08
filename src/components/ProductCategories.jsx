import { CornerDownRight } from "lucide-react";

function Tile({ className = "" }) {
  return <div className={`bg-line/10 ${className}`} />;
}

export default function ProductCategories() {
  return (
    <div id="product-categories" className="px-[2rem] py-[6rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">Product Categories</h1>

      <div className="container flex flex-col py-[3rem]">
        <div className="w-full flex flex-col items-center justify-center gap-3">
          <div className="row1 w-full flex flex-wrap gap-3 py-3 sm:py-6 lg:py-8">
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
          </div>
          <div className="row1 w-full flex flex-wrap gap-3 py-3 sm:py-6 lg:py-8">
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
          </div>
          <div className="row1 w-full flex flex-wrap gap-3 py-3 sm:py-6 lg:py-8">
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80 bg-white"></div>
            <div className="block w-full sm:w-[calc(50%_-_0.375rem)] lg:w-[calc(25%_-_0.5625rem)] aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 lg:h-72 xl:h-80"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-8">
        <a
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent"
          href="#product-categories"
        >
          View All Categories <CornerDownRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
