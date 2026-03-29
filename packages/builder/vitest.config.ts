import { defineConfig } from "vitest/config"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()],
  test: {
    name: "builder",
    globals: true,
    environment: "jsdom",
    include: ["test/unit/**/*.{test,spec}.{ts,tsx}", "test/components/**/*.{test,spec}.{ts,tsx}"],
    deps: {
      inline: [/solid-js/],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "test/"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
