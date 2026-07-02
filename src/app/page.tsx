import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ManifestoSection } from "@/components/manifesto-section";
import { ServicesSection } from "@/components/services-section";
import { WorkSection } from "@/components/work-section";
import { MethodSection } from "@/components/method-section";
import { ProofSection } from "@/components/proof-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ManifestoSection />
        <ServicesSection />
        <WorkSection />
        <MethodSection />
        <ProofSection />
      </main>
    </>
  );
}
