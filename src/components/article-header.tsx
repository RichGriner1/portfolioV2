"use client";

import { HyperText } from "@/components/magicui/hyper-text";
import { pick, useLang, type Bilingual } from "@/lib/i18n";

/**
 * Figma-blog-style article header: mono uppercase date, large display title,
 * and a row of tag pills. Bilingual — every string is a `Bilingual` value
 * resolved via the language toggle.
 */
export function ArticleHeader({
  dateISO,
  title,
  tags,
}: {
  dateISO: string;
  title: Bilingual<string>;
  tags: Bilingual<string[]>;
}) {
  const { lang } = useLang();
  const locale = lang === "es" ? "es-ES" : "en-US";

  const [y, m, d] = dateISO.split("-").map(Number);
  const formattedDate = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1))
    .toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();

  return (
    <header className="flex flex-col gap-4">
      {/* Eyebrow: date · category · category */}
      <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
        <time dateTime={dateISO}>{formattedDate}</time>
        {pick(tags, lang).map((tag) => (
          <span key={tag}>
            <span className="text-border mx-2" aria-hidden>
              ·
            </span>
            {tag}
          </span>
        ))}
      </div>

      {/* No hover replay on an article title — it's the largest type on the site,
          and a pointer crossing it on the way down the page would set the whole
          thing churning. The mount and language-change runs are the point. */}
      <h1 className="text-foreground font-display text-5xl font-black tracking-tight text-balance md:text-6xl lg:text-7xl">
        <HyperText animateOnHover={false}>{pick(title, lang)}</HyperText>
      </h1>
    </header>
  );
}
