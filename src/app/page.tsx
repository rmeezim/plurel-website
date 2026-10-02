import { Hero } from "@/components/hero";
import { ClientsStrip } from "@/components/home/clients-strip";
import { ClosingChapter } from "@/components/home/closing-chapter";
import { FaqChapter } from "@/components/home/faq-chapter";
import { JournalChapter } from "@/components/home/journal-chapter";
import { ManifestoChapter } from "@/components/home/manifesto-chapter";
import { MethodChapter } from "@/components/home/method-chapter";
import { ResultsChapter } from "@/components/home/results-chapter";
import { ServicesChapter } from "@/components/home/services-chapter";
import { WorkChapter } from "@/components/home/work-chapter";

/*
  Home: the film, then seven numbered chapters alternating paper, red and
  oxblood, ending in one red invitation and the footer.
*/
export default function Home() {
  return (
    <main>
      <Hero />
      <ClientsStrip />
      <ManifestoChapter />
      <ServicesChapter />
      <MethodChapter />
      <WorkChapter />
      <ResultsChapter />
      <JournalChapter />
      <FaqChapter />
      <ClosingChapter />
    </main>
  );
}
