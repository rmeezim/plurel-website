import { Hero } from "@/components/hero";
import { ManifestoSection } from "@/components/manifesto-section";
import { ServicesSection } from "@/components/services-section";
import { WorkSection } from "@/components/work-section";
import { MethodSection } from "@/components/method-section";
import { ProofSection } from "@/components/proof-section";
import { JournalSection } from "@/components/journal-section";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <ManifestoSection />
      <ServicesSection />
      <WorkSection />
      <MethodSection />
      <ProofSection />
      <JournalSection />
      <CtaSection />
    </main>
  );
}
