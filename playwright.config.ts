// https://playwright.dev/docs/test-configuration
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: process.env.CI ? undefined : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60 * 1000,
  expect: {
    timeout: 12.5 * 1000,
  },
  outputDir: "tests/output",
  reporter: process.env.CI
    ? [
        ["list"],
        ["html", { outputFolder: "html-report" }],
        ["github"],
        [
          "allure-playwright",
          {
            environmentInfo: {
              framework: "playwright",
            },
          },
        ],
      ]
    : "list",
  use: {
    baseURL: process.env.URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "on",
  },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "Clarity",
      testDir: "./tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
