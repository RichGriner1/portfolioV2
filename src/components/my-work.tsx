"use client";

import Link from "next/link";

import { WorkCard } from "@/components/work-card";
import { sortKey, WORK, type WorkItem } from "@/lib/content/work";
import { pick, useLang, type Bilingual } from "@/lib/i18n";

// Newest first. Order flows down the masonry columns.
const VISIBLE_WORK = WORK.filter((item) => !item.hidden).sort((a, b) =>
  sortKey(b).localeCompare(sortKey(a))
);

// Home is split into two labeled shelves (Figma: Story-architect 104:359):
// Projects = case studies; Processes = how the work gets made (writing,
// methodology — e.g. "Building color in four layers" is a process).
// Home shows three hand-picked case studies, in this order: craft first
// (newest, ongoing), then the standalone brand piece, then systems depth.
// Everything else lives on /projects — case studies stay `featured: false`
// rather than `hidden`, so their pages keep building.
const FEATURED_ORDER = ["visual-identity", "mindfulme", "afi-design-system"];

const PROJECTS = FEATURED_ORDER.map(
  (slug) => VISIBLE_WORK.find((item) => item.slug === slug)!
).filter(Boolean);

const PROCESSES = VISIBLE_WORK.filter((item) => item.kind !== "case-study");

const SHELF_LABELS: Record<"projects" | "processes", Bilingual<string>> = {
  projects: { en: "Projects", es: "Proyectos" },
  processes: { en: "Processes", es: "Procesos" },
};

const ALL_PROJECTS_CTA = {
  href: "/projects",
  label: { en: "See all projects", es: "Ver todos los proyectos" },
};

function SectionRow({
  id,
  label,
  cta,
}: {
  id: string;
  label: Bilingual<string>;
  cta?: { href: string; label: Bilingual<string> };
}) {
  const { lang } = useLang();
  return (
    <div className="flex items-center gap-3">
      <h2 id={id} className="text-muted-foreground shrink-0 font-mono text-xs">
        {pick(label, lang)}
      </h2>
      <div aria-hidden="true" className="bg-border h-px flex-1" />
      {cta && (
        <Link
          href={cta.href}
          className="text-muted-foreground hover:text-foreground duration-base ease-out-soft shrink-0 font-mono text-xs transition-colors"
        >
          {pick(cta.label, lang)} →
        </Link>
      )}
    </div>
  );
}

export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    // Every tile is square, so a real grid beats masonry: three per row on
    // desktop, with rows staying aligned instead of packing ragged columns.
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <WorkCard key={item.slug} item={item} index={index} />
      ))}
    </div>
  );
}

export function MyWork() {
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="shelf-projects" className="flex flex-col gap-6">
        <SectionRow
          id="shelf-projects"
          label={SHELF_LABELS.projects}
          cta={ALL_PROJECTS_CTA}
        />
        <WorkGrid items={PROJECTS} />
      </section>
      <section
        aria-labelledby="shelf-processes"
        className="flex flex-col gap-6"
      >
        <SectionRow id="shelf-processes" label={SHELF_LABELS.processes} />
        <WorkGrid items={PROCESSES} />
      </section>
    </div>
  );
}
