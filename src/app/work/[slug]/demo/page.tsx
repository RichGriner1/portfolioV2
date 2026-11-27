import { notFound } from "next/navigation";

import { DemoFrame } from "@/components/demo-frame";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { WORK } from "@/lib/content/work";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

/** One demo page per case study that has a live prototype (`CaseStudy.demo`). */
export function generateStaticParams() {
  return WORK.filter((w) => !w.hidden && CASE_STUDIES[w.slug]?.demo).map(
    (w) => ({ slug: w.slug })
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  return item ? { title: `${item.title.en} · demo` } : {};
}

export default async function DemoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  const demo = CASE_STUDIES[slug]?.demo;
  if (!item || item.hidden || !demo) notFound();
  return (
    <DemoFrame src={demo.href} back={`/work/${slug}`} title={item.title} />
  );
}
