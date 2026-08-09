/**
 * Moodboard gallery slides (section 3) — the Mobbin screens Richard and
 * Miguel each saved, ported as-is from Coherence's moodboard-slides.ts.
 *
 * Order is deliberate, not the export order: Wise first (the fintech that set
 * the black-and-white-with-color-in-data direction), then the products the
 * post names as references (Cursor, Stack AI, Clerk, Shopify, Notion, Linear),
 * then the rest of the board.
 *
 * `src` points at this repo's own public asset path
 * (public/assets/work/visual-identity/moodboard/) — same filenames/numbering
 * as Coherence's board, copied over so MoodboardGalleryFigure can render the
 * real screens.
 */
export interface MoodboardSlide {
  readonly src: string;
  readonly app: string;
}

export const MOODBOARD_SLIDES: readonly [MoodboardSlide, ...MoodboardSlide[]] =
  [
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-6.jpg",
      app: "Wise",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-7.jpg",
      app: "Wise",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-57.jpg",
      app: "Wise",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-87.jpg",
      app: "Cursor",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-93.jpg",
      app: "Cursor",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-104.jpg",
      app: "Cursor",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-18.jpg",
      app: "Stack AI",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-61.jpg",
      app: "Stack AI",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-20.jpg",
      app: "Clerk",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-82.jpg",
      app: "Clerk",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-105.jpg",
      app: "Clerk",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-33.jpg",
      app: "Shopify",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-17.jpg",
      app: "Notion",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-23.jpg",
      app: "Notion",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-86.jpg",
      app: "Notion",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-98.jpg",
      app: "Notion",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-106.jpg",
      app: "Notion",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-74.jpg",
      app: "Linear",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-88.jpg",
      app: "Linear",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-0.jpg",
      app: "Jira",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-1.jpg",
      app: "Modal",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-2.jpg",
      app: "QuickBooks",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-3.jpg",
      app: "Whop",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-4.jpg",
      app: "Autosend",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-5.jpg",
      app: "Autosend",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-8.jpg",
      app: "Base44",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-9.jpg",
      app: "Clay",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-10.jpg",
      app: "ElevenLabs",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-11.jpg",
      app: "Resend",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-12.jpg",
      app: "Ferndesk",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-13.jpg",
      app: "Zoho CRM",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-14.jpg",
      app: "Cloudflare",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-15.jpg",
      app: "Arcade",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-16.jpg",
      app: "Claude",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-19.jpg",
      app: "Vercel",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-21.jpg",
      app: "Langdock",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-22.jpg",
      app: "Vercel",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-24.jpg",
      app: "Vercel",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-25.jpg",
      app: "Obvious",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-26.jpg",
      app: "Obvious",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-27.jpg",
      app: "komoot",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-28.jpg",
      app: "Open",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-29.jpg",
      app: "Sprig",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-30.jpg",
      app: "Manus",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-31.jpg",
      app: "Apollo",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-32.jpg",
      app: "Modal",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-34.jpg",
      app: "Laravel Cloud",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-35.jpg",
      app: "Alan",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-36.jpg",
      app: "Cloudflare",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-37.jpg",
      app: "Obvious",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-38.jpg",
      app: "Indeed",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-39.jpg",
      app: "Langdock",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-40.jpg",
      app: "Langdock",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-41.jpg",
      app: "Firecrawl",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-42.jpg",
      app: "Profound",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-43.jpg",
      app: "Adaline",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-44.jpg",
      app: "Sentry",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-45.jpg",
      app: "ClickUp",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-46.jpg",
      app: "YouTube Music",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-47.jpg",
      app: "Remote",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-48.jpg",
      app: "Perplexity",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-49.jpg",
      app: "Visual Electric",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-50.jpg",
      app: "Mixpanel",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-51.jpg",
      app: "Todoist",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-52.jpg",
      app: "Rox",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-53.jpg",
      app: "Peec AI",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-54.jpg",
      app: "Neon",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-55.jpg",
      app: "Apollo",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-56.jpg",
      app: "Origin",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-58.jpg",
      app: "Ferndesk",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-59.jpg",
      app: "Etsy",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-60.jpg",
      app: "Ditto",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-62.jpg",
      app: "Vercel",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-63.jpg",
      app: "Base44",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-64.jpg",
      app: "Resend",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-65.jpg",
      app: "ManyChat",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-66.jpg",
      app: "Cosmos",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-67.jpg",
      app: "Obvious",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-68.jpg",
      app: "Laravel Cloud",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-69.jpg",
      app: "Indeed",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-70.jpg",
      app: "Vercel",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-71.jpg",
      app: "Felt",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-72.jpg",
      app: "Base44",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-73.jpg",
      app: "Fireflies",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-75.jpg",
      app: "Laravel Cloud",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-76.jpg",
      app: "Zoho CRM",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-77.jpg",
      app: "Obvious",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-78.jpg",
      app: "Quicken",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-79.jpg",
      app: "Workable",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-80.jpg",
      app: "Juicebox",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-81.jpg",
      app: "Workable",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-83.jpg",
      app: "Obvious",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-84.jpg",
      app: "Juicebox",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-85.jpg",
      app: "Juicebox",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-89.jpg",
      app: "Turo",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-90.jpg",
      app: "Cloudflare",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-91.jpg",
      app: "Cloudflare",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-92.jpg",
      app: "Obvious",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-94.jpg",
      app: "Langdock",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-95.jpg",
      app: "komoot",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-96.jpg",
      app: "Indeed",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-97.jpg",
      app: "Langdock",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-99.jpg",
      app: "Zoho CRM",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-100.jpg",
      app: "Juicebox",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-101.jpg",
      app: "Cloudflare",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-102.jpg",
      app: "Arcade",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-103.jpg",
      app: "Indeed",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-107.jpg",
      app: "Ditto",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-108.jpg",
      app: "Workable",
    },
    {
      src: "/assets/work/visual-identity/moodboard/moodboard-109.jpg",
      app: "Langdock",
    },
  ];
