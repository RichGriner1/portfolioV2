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
  ]),
]);

export default eslintConfig;
