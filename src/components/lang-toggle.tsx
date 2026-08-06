"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLang, type Lang } from "@/lib/i18n";

/**
 * Each language named in itself, never translated. "Español" on an English page is
 * correct — a reader looking for Spanish is scanning for the word they'd use, not
 * for "Spanish". Same reason the list isn't reordered per locale.
 */
const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

/**
 * A menu, matching the theme control beside it, rather than the two-state button
 * this used to be. The button showed the language you'd get by pressing it ("ES"
 * while in English), which is the standard toggle read but the wrong one here: with
 * only two languages there's nothing to tell you which one you're already in. A
 * radio group states the current value and spells both out.
 *
 * The trigger keeps the code rather than taking an icon like `ThemeToggle` does. A
 * globe says "language" but not "English", and the current language is the one thing
 * this control should always be showing. Same `ghost`/`icon` Button, so the two sit
 * as a matched pair in the header and both clear the 24px WCAG 2.5.8 floor at 32px —
 * the old button needed `p-1.5 -m-1.5` to get there.
 */
export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            // Spanish, because it names the control for whoever can't see the label
            // — and the label is the current language, so the aria-label can't just
            // repeat it. Matches `ThemeToggle`'s "Toggle theme".
            aria-label={
              lang === "en" ? "Select language" : "Seleccionar idioma"
            }
          />
        }
      >
        {/* No colour of its own — it inherits the Button's ink, which is what makes
            this and the theme control read as one pair. The old standalone button
            was `text-muted-foreground`; carried over here that left the code at
            lab(48) beside a lab(3) sun icon and the language looked disabled. */}
        <span className="text-sm tracking-wider uppercase">{lang}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(value) => setLang(value as Lang)}
        >
          {LANGS.map((l) => (
            <DropdownMenuRadioItem key={l.value} value={l.value}>
              {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
