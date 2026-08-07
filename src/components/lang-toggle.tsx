"use client";

import { Languages } from "lucide-react";

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
 * The trigger takes the translate icon rather than the language code, reversing an
 * earlier call here. That call was right about what it cared about — a control should
 * state its current value, and "EN" does while a globe doesn't — but it was paying
 * for that with the wrong currency. The code is the only glyph in either toolbar that
 * has to be READ rather than recognised, and on the canvas rail it now sits beside a
 * "100%" readout, which put two small text chips in a row where the eye expected
 * icons. The current language hasn't gone anywhere: the menu is a radio group, so
 * opening it still answers "which one am I in" with a check mark.
 *
 * `Languages` and not `Globe`, deliberately — a globe is the internationalisation
 * cliché and reads as "region" or "worldwide" as often as it reads as "language".
 *
 * Same `ghost`/`icon` Button as the theme control, so the two sit as a matched pair
 * in the header and both clear the 24px WCAG 2.5.8 floor at 32px.
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
        {/* No color of its own — it inherits the Button's ink, which is what makes
            this and the theme control read as one pair. The old standalone button
            was `text-muted-foreground`; carried over here that left the control at
            lab(48) beside a lab(3) sun icon and the language looked disabled. */}
        <Languages />
        {/* The code stays in the accessibility tree, because the icon alone doesn't
            say WHICH language is current and the trigger is the only thing a screen
            reader user meets before deciding whether to open the menu. */}
        <span className="sr-only">{lang}</span>
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
