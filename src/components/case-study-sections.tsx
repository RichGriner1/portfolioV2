import type {
  CaseStudyContext,
  CaseStudyProblem,
  CaseStudyProcess,
  CaseStudySolution,
} from "@/lib/content/case-studies";

const eyebrow =
  "font-mono text-xs tracking-wider uppercase text-muted-foreground";

export function ContextSection({ data }: { data: CaseStudyContext }) {
  return (
    <section className="flex flex-col gap-8">
      <div className={eyebrow}>Context</div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {data.credits?.map((credit) => (
            <div key={credit.name} className="flex flex-col gap-1">
              <div className="text-foreground text-sm">{credit.name}</div>
              <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {credit.role}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
              {data.headline}
            </h2>
            <p className="text-foreground text-base leading-relaxed">
              {data.paragraph}
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {data.blocks.map((block) => (
              <div key={block.label} className="flex flex-col gap-2">
                <div className={eyebrow}>{block.label}</div>
                <p className="text-foreground text-base leading-relaxed">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection({ data }: { data: CaseStudyProblem }) {
  return (
    <section className="flex flex-col gap-8">
      <div className={eyebrow}>Problem</div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <p className="font-display text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
          {data.summary}
        </p>
        <div className="flex flex-col gap-4">
          {data.cards.map((card) => (
            <div
              key={card.title}
              className="bg-card border-border rounded-xl border p-5"
            >
              <div className="text-foreground mb-2 text-sm font-semibold">
                {card.title}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection({ data }: { data: CaseStudyProcess }) {
  return (
    <section className="flex flex-col gap-8">
      <div className={eyebrow}>Process</div>
      <ol className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {data.steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3">
            <div className="text-muted-foreground font-mono text-xs tracking-wider">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="text-foreground text-base font-semibold">
              {step.title}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function SolutionSection({ data }: { data: CaseStudySolution }) {
  return (
    <section className="flex flex-col gap-8">
      <div className={eyebrow}>Solution</div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {data.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-card border-border rounded-xl border p-5"
            >
              <div className="text-foreground mb-2 text-sm font-semibold">
                {pillar.title}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
        <div
          className="bg-muted rounded-xl"
          aria-hidden
          style={{ aspectRatio: "1 / 1" }}
        />
      </div>
    </section>
  );
}
