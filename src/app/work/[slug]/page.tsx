import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/case-study-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { renderDiagram } from "@/lib/diagram";
import { CASE_STUDIES, type CaseStudy } from "@/lib/content/case-studies";
import { DIAGRAMS, type RenderedDiagrams } from "@/lib/content/diagrams";
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
      !item.hidden
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

/** The diagrams this study's cards name, rendered here so pele stays on the server. */
function renderStudyDiagrams(study: CaseStudy | undefined) {
  const rendered: RenderedDiagrams = {};
  for (const card of study?.bento ?? []) {
    const key = card.details?.diagram;
    if (!key || rendered[key]) continue;
    rendered[key] = {
      en: renderDiagram(DIAGRAMS[key].en, `${key}-en`),
      es: renderDiagram(DIAGRAMS[key].es, `${key}-es`),
    };
  }
  return rendered;
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item || item.hidden) notFound();

  const study = CASE_STUDIES[slug];

  return (
    <>
      <SiteHeader />
      <CaseStudyPage
        item={item}
        study={study}
        diagrams={renderStudyDiagrams(study)}
      />
      <SiteFooter />
    </>
  );
}
