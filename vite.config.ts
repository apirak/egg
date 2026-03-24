import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const githubPagesBase = repositoryName ? `/${repositoryName}/` : "/";

// https://vitejs.dev/config/
export default defineConfig({
  base: isGitHubActions ? githubPagesBase : "/",
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
