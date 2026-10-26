import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisciplinePage } from "@/components/discipline-page";
import { PackagePage } from "@/components/package-page";
import { DISCIPLINES, disciplineBySlug } from "@/lib/disciplines";
import { pageMetadata } from "@/lib/metadata";
import { PACKAGES, packageBySlug } from "@/lib/packages";

/*
  /services/[slug]: the four packages (reach, reputation, mindshare,
  revenue; components/package-page.tsx) and the eight individual services
  (components/discipline-page.tsx) share one address space, so every
  service the site sells lives under /services.
*/

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...PACKAGES.map((p) => ({ slug: p.key })), ...DISCIPLINES.map((d) => ({ slug: d.slug }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pkg = packageBySlug(slug);
  if (pkg) {
    return pageMetadata({
      title: `${pkg.term}, a Plurel package`,
      description: `${pkg.want} ${pkg.lead}`,
      path: `/services/${pkg.key}/`,
    });
  }
  const d = disciplineBySlug(slug);
  if (!d) return {};
  return pageMetadata({
    title: `${d.name} — Plurel`,
    description: `${d.tagline} ${d.lead}`,
    path: `/services/${d.slug}/`,
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const pkg = packageBySlug(slug);
  if (pkg) return <PackagePage pkg={pkg} />;
  const d = disciplineBySlug(slug);
  if (!d) notFound();
  return <DisciplinePage d={d} />;
}
