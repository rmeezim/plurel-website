import { Hero } from "@/components/hero";
import { AttentionField } from "@/components/home/attention-field";
import { ClosingChapter } from "@/components/home/closing-chapter";
import { FaqChapter } from "@/components/home/faq-chapter";
import { JournalChapter } from "@/components/home/journal-chapter";
import { ManifestoChapter } from "@/components/home/manifesto-chapter";
import { MethodChapter } from "@/components/home/method-chapter";
import { PeopleChapter } from "@/components/home/people-chapter";
import { ProofChapter } from "@/components/home/proof-chapter";
import { ServicesChapter } from "@/components/home/services-chapter";
import { channelClips } from "@/lib/clips";

/*
  Home: the glass over the film, the Attention Field (how attention
  becomes demand, pinned and scrubbed), then the chapters, alternating
  paper, graphite and red: the problem told through measurement (the
  manifesto and its braid), what the team is made of (Services), how it
  starts (Method, with the Diagnostic), proof (a sample Diagnostic until
  real cases can be published; the people, once they can be shown), the
  questions, the journal, and the Diagnostic itself before the footer.
*/
export default function Home() {
  return (
    <main>
      <Hero />
      <AttentionField clips={channelClips()} />
      <ManifestoChapter />
      <ServicesChapter />
      <MethodChapter />
      <ProofChapter />
      <PeopleChapter />
      <FaqChapter />
      <JournalChapter />
      <ClosingChapter />
    </main>
  );
}
