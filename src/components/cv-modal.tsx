"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.2, 0.8, 0.2, 1] as const;

const CV = {
  name: "Richard Griner",
  title: "UX/UI Designer · AI Builder",
  location: "Madrid, Spain",
  email: "richardgrinerdesigns@gmail.com",
  experience: [
    {
      role: "UX/UI Designer",
      company: "Afi",
      period: "2024 — present",
      description:
        "Designing fintech products for banks and financial institutions at a leading Spanish consultancy. Building a design system from the ground up — migrating products from Material to PrimeNG, architecting a custom token system, and developing an AI-powered platform for white-label products across banking clients.",
    },
    {
      role: "Product Manager & UX Designer",
      company: "Audemic",
      period: "2023 — 2024",
      description:
        "Led product and UX across two sister products under one brand. Defined the product roadmap, ran user research, and built sibling design systems that kept both products visually consistent while serving different user needs.",
    },
    {
      role: "Freelance Designer & AI Builder",
      company: "Independent",
      period: "2022 — present",
      description:
        "Visual strategy, design systems, and AI-assisted development for startups and small businesses. Projects include KT360 (brand identity + AI-powered team environment) and Story Architect (visual strategy + AI-built website).",
    },
  ],
  skills: [
    "Design Systems",
    "Token Architecture",
    "Figma",
    "UX Research",
    "Product Design",
    "Visual Strategy",
    "Tailwind CSS",
    "AI Workflow Design",
    "Brand Strategy",
    "White-label Products",
    "PrimeNG",
    "shadcn/ui",
  ],
  education: [
    {
      degree: "Master's in UX & Service Design",
      school: "IED Madrid",
      year: "2022",
    },
    {
      degree: "BA Anthropology",
      school: "University of Maryland, College Park",
      year: "2020",
    },
  ],
};

export function CvModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      // Clear any lingering state before locking (belt-and-suspenders against
      // stacked state from weird edge cases / previous unmounts).
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // On close OR unmount-while-open: fully restore body and scroll.
        const storedTop = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(storedTop || "0") * -1);
      };
    }

    // Closed state: ensure everything is clear.
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
      >
        CV
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="bg-card border-border fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-3xl border p-8 pb-10 shadow-xl"
              style={{ maxHeight: "85vh" }}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    {CV.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">{CV.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {CV.location} · {CV.email}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none transition-colors"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 flex flex-col gap-6">
                  <div>
                    <h3 className="text-muted-foreground mb-3 font-mono text-xs tracking-wider uppercase">
                      Experience
                    </h3>
                    <div className="flex flex-col gap-5">
                      {CV.experience.map((e) => (
                        <div key={e.role}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-foreground text-sm font-medium">
                              {e.role}
                            </span>
                            <span className="text-muted-foreground shrink-0 font-mono text-xs">
                              {e.period}
                            </span>
                          </div>
                          <div className="text-muted-foreground mb-1 font-mono text-xs">
                            {e.company}
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {e.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-muted-foreground mb-3 font-mono text-xs tracking-wider uppercase">
                      Education
                    </h3>
                    <div className="flex flex-col gap-2">
                      {CV.education.map((e) => (
                        <div key={e.degree}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-foreground text-sm">
                              {e.degree}
                            </span>
                            <span className="text-muted-foreground shrink-0 font-mono text-xs">
                              {e.year}
                            </span>
                          </div>
                          <div className="text-muted-foreground font-mono text-xs">
                            {e.school}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-3 font-mono text-xs tracking-wider uppercase">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {CV.skills.map((s) => (
                      <span
                        key={s}
                        className="border-border text-muted-foreground rounded-full border px-2.5 py-1 font-mono text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
