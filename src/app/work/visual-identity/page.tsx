import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { VisualIdentityArticle } from "./visual-identity-article";

// Static sibling of src/app/work/[slug]/page.tsx — see the exclusion comment
// in that file's generateStaticParams for why the two routes don't conflict.
export const metadata: Metadata = {
  title: "Afi Visual Identity",
  description:
    "Brand strategy, five personas, and a shared definition of modern: the design judgment behind Afi Wealth Planner's visual identity, before a single token got picked.",
};

export default function VisualIdentityPage() {
  return (
    <>
      <SiteHeader />
      <VisualIdentityArticle />
      <SiteFooter />
    </>
  );
}
