import { Hero } from "@/components/hero";
import { AttentionField } from "@/components/home/attention-field";
import { ClientsStrip } from "@/components/home/clients-strip";
import { ClosingChapter } from "@/components/home/closing-chapter";
import { FaqChapter } from "@/components/home/faq-chapter";
import { JournalChapter } from "@/components/home/journal-chapter";
import { ManifestoChapter } from "@/components/home/manifesto-chapter";
import { MethodChapter } from "@/components/home/method-chapter";
import { ResultsChapter } from "@/components/home/results-chapter";
import { ServicesChapter } from "@/components/home/services-chapter";
import { WorkChapter } from "@/components/home/work-chapter";
import { channelClips } from "@/lib/clips";

/*
  Home: the glass over the film, the Attention Field (how Plurel
  distributes, pinned and scrubbed), then seven numbered chapters
  alternating paper, red and graphite, ending in the Diagnostic and the
  footer.
*/
export default function Home() {
  return (
    <main>
      <Hero />
      <AttentionField clips={channelClips()} />
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
