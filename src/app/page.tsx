import { Hero } from "@/components/hero";
import { PartnersStrip } from "@/components/partners-strip";
import { ManifestoSection } from "@/components/manifesto-section";
import { ServicesSection } from "@/components/services-section";
import { GrowthSystemSection } from "@/components/growth-system-section";
import { WorkSection } from "@/components/work-section";
import { PerformanceSection } from "@/components/performance-section";
import { MethodSection } from "@/components/method-section";
import { ProofSection } from "@/components/proof-section";
import { CompareSection } from "@/components/compare-section";
import { StatementSection } from "@/components/statement-section";
import { JournalSection } from "@/components/journal-section";
import { FaqSection } from "@/components/faq-section";
import { FounderNote } from "@/components/founder-note";
import { GrowthAuditSection } from "@/components/growth-audit-section";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnersStrip />
      <ManifestoSection />
      <ServicesSection />
      <GrowthSystemSection />
      <WorkSection />
      <PerformanceSection />
      <MethodSection />
      <ProofSection />
      <CompareSection />
      <StatementSection
        kicker="The AI-era standard"
        note="AEO — built into every engagement"
        surface="ink"
      >
        Be the <em className="italic text-clay">answer</em>, not the ad.
      </StatementSection>
      <JournalSection />
      <FaqSection />
      <FounderNote />
      <GrowthAuditSection />
      <CtaSection />
    </main>
  );
}
