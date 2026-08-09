import { Fira_Sans, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

// Section 5 is about a font-metrics defect (digit width drift), so the point
// only lands with the real typefaces — self-hosted via next/font/google, same
// approach layout.tsx already uses for Geist/Roboto. Geist itself is already
// loaded globally (--font-geist / `font-geist`), reused here instead of a
// second copy.
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "500",
});

export const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: "500",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "500",
});
