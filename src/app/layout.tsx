import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";
import { DotCursor } from "@/components/motion/dot-cursor";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

// Typography — self-hosted via next/font, no external Google requests.
//
// Geist everywhere. Roboto served --font-sans, Roboto Flex --font-display and
// Roboto Mono --font-mono, with Geist scoped to the bento only; the site now uses
// one family across all three slots. The slots stay as separate variables rather
// than collapsing to one, because every `font-sans` / `font-display` / `font-mono`
// utility in the codebase points at them — swapping what they resolve to changes
// the whole site without touching a call site, and leaves the seams in place if a
// display or mono cut is ever reintroduced.
//
// Geist Mono, not Geist, fills the mono slot: code blocks in the blog need real
// monospace, and the eyebrow labels that use `font-mono` decoratively want the
// same family's mono cut rather than a proportional face pretending to be one.
const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// --font-display and --font-geist both resolve to Geist. `--font-geist` is kept
// because components reference `font-geist` directly (the header, the bento copy),
// and pointing it at the same face is a smaller change than renaming every use.
const geistDisplay = Geist({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
});

const geistNamed = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Richard Griner — Design Systems & UX/UI Designer",
    template: "%s | Richard Griner",
  },
  description:
    "Design Systems Designer and UX/UI Designer specializing in AI and Fin-tech, helping teams ship thoughtful, systemized product experiences.",
  authors: [{ name: "Richard Griner" }],
  creator: "Richard Griner",
  metadataBase: new URL("https://richardgriner.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Richard Griner",
    title: "Richard Griner — Design Systems & UX/UI Designer",
    description:
      "Design Systems Designer and UX/UI Designer specializing in AI and Fin-tech.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Richard Griner",
    description:
      "Design Systems Designer and UX/UI Designer specializing in AI and Fin-tech.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${geistDisplay.variable} ${geistNamed.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LangProvider>
            {children}
            <DotCursor />
          </LangProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
