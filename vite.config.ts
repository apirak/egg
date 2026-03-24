import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

const configuredBase = process.env.VITE_BASE_PATH;

function normalizeBase(basePath: string): string {
  const withLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: normalizeBase(configuredBase ?? "/"),
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        additionalPrerenderRoutes: ["/404"],
        previewMiddlewareEnabled: true,
        previewMiddlewareFallback: "/404",
      },
    }),
  ],
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
