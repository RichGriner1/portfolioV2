import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/case-study-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { WORK } from "@/lib/content/work";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return WORK.filter((item) => item.kind !== "lab").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item) return {};
  return {
    title: item.title.en,
    description: item.description.en,
  };
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item) notFound();

  const study = CASE_STUDIES[slug];

  return (
    <>
      <SiteHeader />
      <CaseStudyPage item={item} study={study} />
      <SiteFooter />
    </>
  );
}
