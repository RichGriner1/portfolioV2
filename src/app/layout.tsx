import type { Metadata } from "next";
import { Geist, Roboto, Roboto_Flex, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

// Typography — self-hosted via next/font, no external Google requests.
// Roboto serves both body and display; heavier weights (700, 900) give the
// memorisely-style confident headers. Mono stays in its own family.
const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Geist — descriptions / supporting copy (per Richard's Figma direction).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Display cut — fills the --font-display slot (see globals.css). Roboto Flex
// is variable by default (wght included), so only the extra axes it needs
// for the wide/heavy display cut (opsz, wdth) are requested.
const robotoFlex = Roboto_Flex({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
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
      className={`${roboto.variable} ${robotoMono.variable} ${robotoFlex.variable} ${geist.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LangProvider>{children}</LangProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
