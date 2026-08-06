"use client";

import Link from "next/link";

import { t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The "← back" link that opens every content page.
 *
 * Extracted because there were six hand-written copies and they had drifted into
 * three different spacings: 64px from the link to the content on a case study, 40px
 * on writing posts and the color methodology, and 40px on /writing and /projects but
 * pushed 136px down the page by a larger top padding. Richard flagged the case study
 * as the one that looked right, so 64px is the target everywhere.
 *
 * The gap is a `mb` here rather than the parent's flex `gap`, because those parents
 * use their gap for ALL their sections — the case study wants 64px between its bento
 * and its "more work" shelf too, while a writing post wants 40px between article and
 * shelf. Owning the link's own bottom spacing normalizes the one distance Richard
 * cares about without touching the rest of any page's rhythm.
 *
 * So: pages whose parent gap is 40px get the default `mb-6` (40 + 24 = 64). The case
 * study already gaps 64 and passes `mb-0`.
 */
export function BackLink({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  const { lang } = useLang();

  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground hover:text-foreground w-fit font-mono text-xs tracking-wider uppercase transition-colors",
        "mb-6",
        className
      )}
    >
      {t("work.back", lang)}
    </Link>
  );
}
