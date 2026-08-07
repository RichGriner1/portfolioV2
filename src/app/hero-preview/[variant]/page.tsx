import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";

import { HeroVariantSolo } from "../hero-variants";
import { slugOf, VARIANT_KEYS } from "../variant-keys";

// One hero per URL, full viewport, no siblings competing for the frame. The index
// at /hero-preview stacks them a few hundred pixels tall each, which is fine for
// spotting differences and useless for judging whether a composition works.
export function generateStaticParams() {
  return VARIANT_KEYS.map((key) => ({ variant: slugOf(key) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  return { title: `Hero ${variant.toUpperCase()}` };
}

export default async function HeroVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  if (!VARIANT_KEYS.some((key) => slugOf(key) === variant)) notFound();

  return (
    <>
      <SiteHeader />
      <HeroVariantSolo slug={variant} />
    </>
  );
}
