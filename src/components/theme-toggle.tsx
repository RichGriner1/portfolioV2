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

/**
 * animate-ui's `ThemeTogglerButton`, rendered with this repo's own `Button` so it stays
 * the same 32px ghost square as the language selector beside it.
 *
 * A cycling button, not the dropdown this used to be: light → dark → system → light,
 * with the icon naming the mode you're currently in. That's the control Richard asked
 * for, and the wipe belongs to it — the effect reads as caused by the press.
 */
const MODES: ThemeSelection[] = ["light", "dark", "system"];

const ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

function nextMode(effective: ThemeSelection): ThemeSelection {
  const i = MODES.indexOf(effective);
  return MODES[(i + 1) % MODES.length];
}

const LABELS: Record<ThemeSelection, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
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
          <Button
            variant="ghost"
            size="icon"
            aria-label={`${mounted ? LABELS[effective] : LABELS.system} — switch to ${nextMode(effective).replace("system", "system default")}`}
            onClick={() => toggleTheme(nextMode(effective))}
          >
            <Icon className="size-4" />
          </Button>
        );
      }}
    </ThemeToggler>
  );
}
