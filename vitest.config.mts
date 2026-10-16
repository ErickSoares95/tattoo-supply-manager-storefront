import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Based on the Next.js Vitest guide (node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md);
// Vite resolves the tsconfig "@/" paths natively, so vite-tsconfig-paths is not needed.
// jsdom by default for components/contexts; server-side tests opt into the node environment
// with a `// @vitest-environment node` comment.
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
