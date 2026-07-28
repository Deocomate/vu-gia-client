import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal, scoped config: this repo's frontend has no other test infrastructure yet
// (checked: no jest/vitest config, no other *.test.js files under src). Restricting
// `include` to `src/**/*.test.js` keeps this from picking up the unrelated Playwright
// e2e script at the repo root (`e2e-verification.spec.js`, requires `@playwright/test`,
// not a vitest suite) or anything under node_modules. No jsdom/React plugin — modules
// under test are plain-JS math/pure-function exports with no DOM dependency; components
// that transitively import React/JSX (e.g. `altar-canvas.jsx`, imported by its
// `altar-canvas.test.js` only for its exported pure helpers) resolve fine under Vite's
// default esbuild JSX handling in a plain Node environment as long as nothing actually
// touches the DOM at module-eval time.
//
// `resolve.alias` mirrors `jsconfig.json`'s `@/* -> ./src/*` — Vite does not read
// jsconfig paths automatically (no vite-tsconfig-paths plugin here), and every altar
// component under `src/shared/components/altar/` imports its siblings via the `@/`
// alias, so tests that transitively pull those files in need it resolved too.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.test.js"],
    environment: "node",
  },
});
