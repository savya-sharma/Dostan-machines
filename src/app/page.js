import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import DostanAdvantage from "@/components/DostanAdvantage";
import ProductCategories from "@/components/ProductCategories";
import EndToEndSolutions from "@/components/EndToEndSolutions";
import Process from "@/components/Process";
import InstalledProjects from "@/components/InstalledProjects";
import Testimonials from "@/components/Testimonials";
import FactoryManufacturing from "@/components/FactoryManufacturing";
import KnowledgeCenter from "@/components/KnowledgeCenter";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <DostanAdvantage />
      <ProductCategories />
      <EndToEndSolutions />
      <Process />
      <InstalledProjects />
      <Testimonials />
      <FactoryManufacturing />
      <KnowledgeCenter />
      <FAQ />
    </>
  );
}
