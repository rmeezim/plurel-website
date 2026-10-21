import { Hero } from "@/components/hero";
import { AccountabilityChapter } from "@/components/home/accountability";
import { ClosingChapter } from "@/components/home/closing-chapter";
import { FaqChapter } from "@/components/home/faq-chapter";
import { JournalChapter } from "@/components/home/journal-chapter";
import { MethodChapter } from "@/components/home/method-chapter";
import { PeopleChapter } from "@/components/home/people-chapter";
import { ProofChapter } from "@/components/home/proof-chapter";
import { ServicesChapter } from "@/components/home/services-chapter";
import { StatementChapter } from "@/components/home/statement";
import { WhoItsForChapter } from "@/components/home/who-its-for";
import { WhyNowChapter } from "@/components/home/why-now";

/*
  Home, as one argument: the promise (the glass over the film), what
  Plurel is, why now, why one system (the services chapter, which ends on
  the Plurel System), how an engagement runs (Method), what we answer for,
  who it is built for, what a Diagnostic finds (a labelled sample until
  real cases can be published; the people, once they can be shown), the
  questions, the journal, and the Diagnostic itself before the footer.
  Tones: graphite hero and statement, paper, graphite, red, paper, red,
  graphite, paper, paper, red.
*/
export default function Home() {
  return (
    <main>
      <Hero />
      <StatementChapter />
      <WhyNowChapter />
      <ServicesChapter />
      <MethodChapter />
      <AccountabilityChapter />
      <WhoItsForChapter />
      <ProofChapter />
      <PeopleChapter />
      <FaqChapter />
      <JournalChapter />
      <ClosingChapter />
    </main>
  );
}
