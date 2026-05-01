import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BreathingPage } from "@/components/breathing/breathing-page";

export const metadata: Metadata = {
  title: "Breathing",
  description:
    "A micro-break breathing exercise randomizer. Five guided techniques with an animated breathing ball.",
};

export default function BreathingRoute() {
  return (
    <>
      <SiteHeader />
      <BreathingPage />
      <SiteFooter />
    </>
  );
}
