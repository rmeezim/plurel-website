import { Hero } from "@/components/hero";
import { AccountabilityChapter } from "@/components/home/accountability";
import { CameForChapter } from "@/components/home/came-for";
import { ClosingChapter } from "@/components/home/closing-chapter";
import { FaqChapter } from "@/components/home/faq-chapter";
import { MethodChapter } from "@/components/home/method-chapter";
import { PeopleChapter } from "@/components/home/people-chapter";
import { ProofChapter } from "@/components/home/proof-chapter";
import { ServicesChapter } from "@/components/home/services-chapter";
import { StatementChapter } from "@/components/home/statement";
import { WhoItsForChapter } from "@/components/home/who-its-for";
import { EngineChapter } from "@/components/home/engine";
import { HOME, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ ...HOME, path: "/" });

/*
  Home, as one argument, in the order a visitor asks: the promise (the
  glass over the film), what Plurel is, what you came for (reach,
  reputation, mindshare and revenue, set as one sum), how the market
  moves (the engine: buyers decide before they arrive, across many
  surfaces, and one system reads and moves all of them), why one system
  (the services chapter, which ends on the Plurel System), how an
  engagement runs (Method), what we answer for, who it is built for,
  what a Diagnostic finds (a labelled sample in one screen, the full one
  a page of its own, until real cases can be published; the people, once
  they can be shown), the questions, and the Diagnostic itself before the
  footer. The Journal stays one click away, in the nav and the footer.
  Tones: one graphite room, footer included, punctuated by the red What
  you came for, Method, Who it's for and closing.
*/
export default function Home() {
  return (
    <main data-room="dark">
      <Hero />
      <StatementChapter />
      <CameForChapter />
      <EngineChapter />
      <ServicesChapter />
      <MethodChapter />
      <AccountabilityChapter />
      <WhoItsForChapter />
      <ProofChapter />
      <PeopleChapter />
      <FaqChapter />
      <ClosingChapter />
    </main>
  );
}
