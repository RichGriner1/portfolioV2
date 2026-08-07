/**
 * Variant keys and the slug helper, in a plain module on purpose.
 *
 * hero-variants.tsx is `"use client"`, and a server component importing a value
 * from a client module gets a client reference proxy rather than the value — so
 * `generateStaticParams` reading VARIANTS there failed with "VARIANTS.map is not
 * a function". Anything both sides need lives here instead.
 *
 * Order matches the display order in hero-variants.tsx.
 */
export const VARIANT_KEYS = [
  "A5",
  "A4",
  "A3",
  "A1",
  "A2",
  "A",
  "B",
  "C",
  "D",
  "E",
] as const;

export const slugOf = (key: string) => key.toLowerCase();
