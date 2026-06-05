import Link from "next/link";

import { CvModal } from "@/components/cv-modal";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-6">
        <Link
          href="/"
          className="font-display text-base tracking-tight transition-opacity hover:opacity-70"
        >
          Richard Griner
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-muted-foreground text-sm">
            <CvModal />
          </div>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
