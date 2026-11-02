import path from "node:path";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results/playwright",
  workers: 3,
  use: {
    viewport: { width: 1440, height: 900 },
    baseURL: "http://127.0.0.1:3011/store/",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --port 3011",
    url: "http://127.0.0.1:3011/store/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  reporter: [["list"], ["html", { outputFolder: path.join("test-results", "playwright-report"), open: "never" }]],
});
