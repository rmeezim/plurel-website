import { AeoFigure, AnalyticsFigure, BrandingFigure, CmoFigure, ContentFigure, PaidFigure, PrFigure, UgcFigure, VideoFigure, VitalsFigure } from "@/components/figures/disciplines";
import { MindshareFigure, ReachFigure, ReputationFigure, RevenueFigure } from "@/components/figures/engagements";

/*
  Each service page's figure, by the page's key: the engagements by name
  (reach, reputation, mindshare, revenue), the disciplines by slug. One
  point each, drawn the way an editor would draw it (figures/kit.tsx).
*/

export function Instrument({ k }: { k: string }) {
  switch (k) {
    case "reach":
      return <ReachFigure />;
    case "reputation":
      return <ReputationFigure />;
    case "mindshare":
      return <MindshareFigure />;
    case "revenue":
      return <RevenueFigure />;
    case "fractional-cmo":
      return <CmoFigure />;
    case "branding":
      return <BrandingFigure />;
    case "website-design":
      return <VitalsFigure />;
    case "content-marketing":
      return <ContentFigure />;
    case "video-photo":
      return <VideoFigure />;
    case "ugc-creators":
      return <UgcFigure />;
    case "paid-media":
      return <PaidFigure />;
    case "aeo-seo":
      return <AeoFigure />;
    case "pr-reputation":
      return <PrFigure />;
    case "analytics-martech":
      return <AnalyticsFigure />;
    default:
      return null;
  }
}
