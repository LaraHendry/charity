/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    exclude: ["tests/**", "node_modules/**"],
    environment: "jsdom",
    globalSetup: "./src/__test__/globalSetup.ts",
    setupFiles: "./src/__test__/setupTests.tsx",
    coverage: {
      reporter: [["json", { file: `coverage-${process.env.VITEST_SHARD}.json` }]],
      exclude: ["node_modules/", "src/__test__/setupTests.tsx"],
    },
    server: {
      deps: {
        inline: [/@radix-ui\/react-popover/],
      },
    },
  },

  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: "build",
  },
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    open: true,
    port: 3000,
  },
});
