import { Readout } from "@/components/artifacts/kit";
import { DisciplineArt } from "@/components/artifacts/discipline-art";
import { PackageArt } from "@/components/artifacts/package-art";
import { ReachConsole } from "@/components/console/reach";
import type { EngagementKey } from "@/lib/nav";

/*
  Each service page's live instrument, by the page's key: the engagements
  by name (reach, reputation, mindshare, revenue), the disciplines by
  slug. Each is its own client component, so a page loads only its own.
*/

export function Instrument({ k, readout }: { k: string; readout: readonly string[] }) {
  switch (k) {
    case "reach":
      return <ReachConsole />;
    case "reputation":
    case "mindshare":
    case "revenue":
      return <PackageArt pkg={k as EngagementKey} caption={<Readout items={readout} />} />;
    default:
      return <DisciplineArt slug={k} caption={<Readout items={readout} />} />;
  }
}
