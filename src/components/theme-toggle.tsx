"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import {
  useThemeSweep,
  type ThemeChoice,
} from "@/components/motion/use-theme-sweep";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MODES: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ThemeToggle() {
  /**
   * `useThemeSweep` in place of next-themes' bare `setTheme`: the change now wipes
   * down the page via the View Transitions API instead of cutting. It falls back to
   * an instant swap under `prefers-reduced-motion`, without the API, or when the
   * resolved theme isn't actually changing — see use-theme-sweep.ts.
   */
  const setTheme = useThemeSweep();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Toggle theme" />
        }
      >
        <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {MODES.map(({ value, label, Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
