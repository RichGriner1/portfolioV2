import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // HyperFrames motion projects — self-contained node projects with their
    // own tooling; they are authoring sources, not app code.
    "videos/**",
    // Nested Design System Template app — its own Next.js project with its own
    // tooling; ".next/**" above only matches at the repo root, not its build dir.
    "Design System Template/**",
    // Agent session worktrees are full checkouts of this repo; linting them
    // would report every warning twice.
    ".claude/worktrees/**",
  ]),
  {
    // A leading underscore marks a parameter kept for the signature (glyphs
    // share one props type) but not read.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
