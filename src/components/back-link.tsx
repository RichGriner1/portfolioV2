"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The pages a visitor browses from. A case study or a post goes back to whichever of
 * these they last came from; `/` reopens the canvas or the traditional page by itself,
 * from the cookie the view switch writes.
 */
const INDEX_PAGES = ["/", "/projects", "/writing"];
const LAST_INDEX = "nav:last-index";
const PREV_PATH = "nav:prev-path";

function read(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Remembers, for this tab, the last index page and the page before the current one.
 * Mounted once in the root layout. Session storage can be missing (blocked site
 * data), in which case the back link falls back to its default.
 */
export function NavMemory() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const cur = sessionStorage.getItem("nav:cur");
      if (cur && cur !== pathname) sessionStorage.setItem(PREV_PATH, cur);
      sessionStorage.setItem("nav:cur", pathname);
      if (INDEX_PAGES.includes(pathname))
        sessionStorage.setItem(LAST_INDEX, pathname);
    } catch {}
  }, [pathname]);
  return null;
}

/**
 * The "← back" link that opens every content page.
 *
 * It goes back to the index page the visitor came from (home, Projects or Writing),
 * not always home. When that page is the one right before this, it steps back in the
 * browser's history instead, so the visitor lands where they were on it, scroll and
 * all. `href` is the fallback for a visitor who arrived here directly.
 *
 * Spacing: pages whose parent gap is 40px get the default `mb-6` (40 + 24 = 64, the
 * case study's distance from the link to the content). The case study already gaps
 * 64 and passes `mb-0`.
 */
export function BackLink({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  const { lang } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [target, setTarget] = useState(href);
  useEffect(() => {
    const last = read(LAST_INDEX);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- session storage only exists on the client
    if (last && last !== pathname) setTarget(last);
  }, [pathname]);

  return (
    <Link
      href={target}
      onClick={(e) => {
        if (read(PREV_PATH) !== target || e.metaKey || e.ctrlKey || e.shiftKey)
          return;
        e.preventDefault();
        router.back();
      }}
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
