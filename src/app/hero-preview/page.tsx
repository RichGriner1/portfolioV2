import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { HeroVariants } from "./hero-variants";

// Preview surface, same pattern as /figures-preview: not linked from anywhere,
// exists so hero candidates can be judged in the real font stack and token ramp
// rather than in a mockup. Delete once the home hero lands.
export const metadata: Metadata = {
  title: "Hero Preview",
  description: "Candidate home-page heroes for the positioning rebuild.",
};

export default function HeroPreviewPage() {
  return (
    <>
      <SiteHeader />
      <HeroVariants />
      <SiteFooter />
    </>
  );
}
