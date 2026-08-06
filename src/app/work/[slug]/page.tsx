import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/case-study-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { WORK } from "@/lib/content/work";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return WORK.filter(
    (item) =>
      item.kind !== "lab" &&
      item.kind !== "methodology" &&
      // A blog post's canonical home is /writing/<slug>. Generating a /work/ page
      // for it too would publish a second URL for the same piece, rendering the
      // no-case-study fallback.
      item.kind !== "blog" &&
      !item.hidden &&
      // "visual-identity" has its own static route at src/app/work/visual-identity/
      // — the literal segment wins over [slug] regardless of dynamicParams, but
      // including it here too would make the build try to statically render the
      // same URL from both routes and fail.
      item.slug !== "visual-identity"
  ).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item || item.hidden) return {};
  return {
    title: item.title.en,
    description: item.description.en,
  };
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item || item.hidden) notFound();

  const study = CASE_STUDIES[slug];

  return (
    <>
      <SiteHeader />
      <CaseStudyPage item={item} study={study} />
      <SiteFooter />
    </>
  );
}
