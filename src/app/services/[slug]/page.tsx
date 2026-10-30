import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisciplinePage } from "@/components/discipline-page";
import { EngagementPage } from "@/components/engagement-page";
import { DISCIPLINES, disciplineBySlug } from "@/lib/disciplines";
import { pageMetadata } from "@/lib/metadata";
import { ENGAGEMENTS, engagementBySlug } from "@/lib/engagements";

/*
  /services/[slug]: the four engagements (reach, reputation, mindshare,
  revenue; components/engagement-page.tsx) and the ten disciplines
  (components/discipline-page.tsx) share one address space, so everything
  the site sells lives under /services.
*/

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...ENGAGEMENTS.map((p) => ({ slug: p.key })), ...DISCIPLINES.map((d) => ({ slug: d.slug }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pkg = engagementBySlug(slug);
  if (pkg) {
    return pageMetadata({
      title: `${pkg.term}, a Plurel engagement`,
      description: `${pkg.want} ${pkg.lead}`,
      path: `/services/${pkg.key}/`,
    });
  }
  const d = disciplineBySlug(slug);
  if (!d) return {};
  return pageMetadata({
    title: `${d.name}, a Plurel discipline`,
    description: `${d.tagline} ${d.lead}`,
    path: `/services/${d.slug}/`,
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const pkg = engagementBySlug(slug);
  if (pkg) return <EngagementPage pkg={pkg} />;
  const d = disciplineBySlug(slug);
  if (!d) notFound();
  return <DisciplinePage d={d} />;
}
