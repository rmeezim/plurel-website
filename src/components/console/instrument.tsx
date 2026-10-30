import { AllocationConsole } from "@/components/console/allocation";
import { AnswerTraceConsole } from "@/components/console/answer-trace";
import { BrandMonitorConsole } from "@/components/console/brand-monitor";
import { CascadeConsole } from "@/components/console/cascade";
import { ConsensusConsole } from "@/components/console/consensus";
import { DecisionLogConsole } from "@/components/console/decision-log";
import { EditSuiteConsole } from "@/components/console/edit-suite";
import { HookTestConsole } from "@/components/console/hook-test";
import { LedgerConsole } from "@/components/console/ledger";
import { MemoryConsole } from "@/components/console/memory";
import { PathFlowConsole } from "@/components/console/path-flow";
import { ReachConsole } from "@/components/console/reach";
import { ReframeConsole } from "@/components/console/reframe";
import { VitalsConsole } from "@/components/console/vitals";

/*
  Each service page's live instrument, by the page's key: the engagements
  by name (reach, reputation, mindshare, revenue), the disciplines by
  slug. Each is its own client component, so a page loads only its own.
*/

export function Instrument({ k }: { k: string }) {
  switch (k) {
    case "reach":
      return <ReachConsole />;
    case "reputation":
      return <ConsensusConsole />;
    case "mindshare":
      return <MemoryConsole />;
    case "revenue":
      return <PathFlowConsole />;
    case "fractional-cmo":
      return <DecisionLogConsole />;
    case "branding":
      return <BrandMonitorConsole />;
    case "website-design":
      return <VitalsConsole />;
    case "content-marketing":
      return <EditSuiteConsole />;
    case "video-photo":
      return <ReframeConsole />;
    case "ugc-creators":
      return <HookTestConsole />;
    case "paid-media":
      return <AllocationConsole />;
    case "aeo-seo":
      return <AnswerTraceConsole />;
    case "pr-reputation":
      return <CascadeConsole />;
    case "analytics-martech":
      return <LedgerConsole />;
    default:
      return null;
  }
}
