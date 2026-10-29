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
import ContactCTA from "@/components/ContactCTA";
import DiwaliOnly from "@/components/festival/diwali/DiwaliOnly";
import DiwaliSectionDivider from "@/components/festival/diwali/DiwaliSectionDivider";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <DostanAdvantage />
      <ProductCategories />
      <DiwaliOnly>
        <DiwaliSectionDivider variant="lotus" />
      </DiwaliOnly>
      <EndToEndSolutions />
      <Process />
      <InstalledProjects />
      <Testimonials />
      <FactoryManufacturing />
      <KnowledgeCenter />
      <DiwaliOnly>
        <DiwaliSectionDivider variant="facet" />
      </DiwaliOnly>
      <FAQ />
      <ContactCTA />
    </>
  );
}
