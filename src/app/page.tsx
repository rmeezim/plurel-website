import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ServicesSection } from "@/components/services-section";
import { WorkSection } from "@/components/work-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ServicesSection />
        <WorkSection />
      </main>
    </>
  );
}
