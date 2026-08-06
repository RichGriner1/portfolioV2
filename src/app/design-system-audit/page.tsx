import type { Metadata } from "next";

import { AuditLanding } from "./audit-landing";

const TITLE = "Design System Audit — Richard Griner";
const DESCRIPTION =
  "A one-week, flat-fee design system audit for AI and fintech teams — a UI drift map, a token and component gap analysis, and a 90-day roadmap.";

// This page is the redirect target for /offer and /audit — the URL that
// gets pasted into cold emails and DMs. It needs its own share metadata so
// link previews render audit copy instead of inheriting the homepage card
// from the root layout.
export const metadata: Metadata = {
  title: "Design System Audit",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://richardgriner.com/design-system-audit",
    siteName: "Richard Griner",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DesignSystemAuditPage() {
  return <AuditLanding />;
}
