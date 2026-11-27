"use client";

import { useRouter } from "next/navigation";
import { Frame, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveHomeView, type HomeView } from "@/lib/home-view";
import { t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "canvas", key: "view.canvas", Icon: Frame },
  { value: "list", key: "view.list", Icon: List },
] as const;

/**
 * Canvas / List, for the home page only.
 *
 * Both options are spelled out and always visible. The visitor this exists for is
 * the hiring manager who doesn't work in Figma, and a hidden menu or a lone icon
 * asks them to already know there's another way to see the page.
 *
 * Desktop only (`lg`, where the board starts). Below it the canvas is already a
 * stacked scrolling page, so there's nothing to rescue anyone from, and a phone
 * header has no room for it beside the language and theme controls.
 *
 * Choosing writes the cookie and refreshes, so the server renders the other layout
 * on this visit and on every return.
 */
export function ViewSwitch({
  current,
  className,
}: {
  current: HomeView;
  className?: string;
}) {
  const { lang } = useLang();
  const router = useRouter();

  const choose = (view: HomeView) => {
    if (view === current) return;
    saveHomeView(view);
    // The stacked canvas scrolls; the list should open at its top, not partway down.
    window.scrollTo(0, 0);
    // A `?view=` link outranks the cookie, so drop it or the choice won't take.
    if (window.location.search) router.replace("/");
    else router.refresh();
  };

  return (
    <div
      role="group"
      aria-label={t("view.label", lang)}
      className={cn(
        "border-border bg-background/70 hidden items-center gap-0.5 rounded-xl border p-0.5 backdrop-blur-md lg:flex",
        className
      )}
    >
      {OPTIONS.map(({ value, key, Icon }) => (
        <Button
          key={value}
          variant={value === current ? "default" : "ghost"}
          size="sm"
          aria-pressed={value === current}
          onClick={() => choose(value)}
        >
          <Icon />
          {t(key, lang)}
        </Button>
      ))}
    </div>
  );
}
