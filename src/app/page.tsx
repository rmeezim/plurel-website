import { Hero } from "@/components/hero";
import { AccountabilityChapter } from "@/components/home/accountability";
import { ClosingChapter } from "@/components/home/closing-chapter";
import { EngagementsChapter } from "@/components/home/engagements";
import { FaqChapter } from "@/components/home/faq-chapter";
import { MethodChapter } from "@/components/home/method-chapter";
import { PeopleChapter } from "@/components/home/people-chapter";
import { ProofChapter } from "@/components/home/proof-chapter";
import { ServicesChapter } from "@/components/home/services-chapter";
import { ShiftChapter } from "@/components/home/shift";
import { StatementChapter } from "@/components/home/statement";
import { WhoItsForChapter } from "@/components/home/who-its-for";
import { HOME, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ ...HOME, path: "/" });

/*
  Home, as a sales argument in the order a buyer needs it: the promise
  (the glass over the film); what Plurel is; why it exists (buyers decide
  before they arrive, across many surfaces, each with its own supplier);
  the thesis (your marketing shouldn't be ten companies: the services
  chapter, ending on the Plurel System); what Plurel does differently
  (it answers for one number); then the offer (What you came for: the
  four engagements, each with its drawing and a way in) and how it runs
  (Method); what a Diagnostic finds; who it is built for; the people,
  once they can be shown; the questions; and the Diagnostic itself
  before the footer. Tones: one graphite room, footer included,
  punctuated by the red Method, Who it's for and closing, never two
  touching.
*/
export default function Home() {
  return (
    <main data-room="dark">
      <Hero />
      <StatementChapter />
      <ShiftChapter />
      <ServicesChapter />
      <AccountabilityChapter />
      <EngagementsChapter />
      <MethodChapter />
      <ProofChapter />
      <WhoItsForChapter />
      <PeopleChapter />
      <FaqChapter />
      <ClosingChapter />
    </main>
  );
}
