import { Hero } from "@/components/hero";
import { ManifestoSection } from "@/components/manifesto-section";
import { ServicesSection } from "@/components/services-section";
import { GrowthSystemSection } from "@/components/growth-system-section";
import { WorkSection } from "@/components/work-section";
import { PerformanceSection } from "@/components/performance-section";
import { MethodSection } from "@/components/method-section";
import { ProofSection } from "@/components/proof-section";
import { JournalSection } from "@/components/journal-section";
import { GrowthAuditSection } from "@/components/growth-audit-section";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <ManifestoSection />
      <ServicesSection />
      <GrowthSystemSection />
      <WorkSection />
      <PerformanceSection />
      <MethodSection />
      <ProofSection />
      <JournalSection />
      <GrowthAuditSection />
      <CtaSection />
    </main>
  );
}
