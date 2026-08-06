"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  ThemeToggler,
  type Resolved,
  type ThemeSelection,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLang } from "@/lib/i18n";

/**
 * animate-ui's `ThemeTogglerButton`, rendered with this repo's own `Button` so it stays
 * the same 32px ghost square as the language selector beside it.
 *
 * A dropdown, not a cycling button: pick light/dark/system directly. A radio group states
 * the current mode instead of just naming the mode you'd get by clicking, matching
 * `LangToggle`'s reasoning. `toggleTheme` still drives the view-transition wipe, so
 * picking a mode reads the same as the old toggle — the effect is caused by the click.
 */
const MODES: ThemeSelection[] = ["light", "dark", "system"];

const ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

const LABELS: Record<ThemeSelection, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { lang } = useLang();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <ThemeToggler
      theme={(theme as ThemeSelection) ?? "system"}
      resolvedTheme={(resolvedTheme as Resolved) ?? "light"}
      setTheme={setTheme}
      direction="ltr"
    >
      {({ effective, toggleTheme }) => {
        // Before mount there is no resolved theme, so render the neutral icon rather
        // than guessing and flipping on hydration.
        const Icon = mounted ? ICONS[effective] : Sun;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={
                    lang === "en" ? "Select theme" : "Seleccionar tema"
                  }
                />
              }
            >
              <Icon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={effective}
                onValueChange={(value) => toggleTheme(value as ThemeSelection)}
              >
                {MODES.map((mode) => {
                  const ModeIcon = ICONS[mode];
                  return (
                    // Base UI radio items keep the menu open by default; this menu
                    // is a pick-and-done control, and the page-wide wipe shouldn't
                    // run behind a still-open popup.
                    <DropdownMenuRadioItem key={mode} value={mode} closeOnClick>
                      <ModeIcon className="size-4" />
                      {LABELS[mode]}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    </ThemeToggler>
  );
}
