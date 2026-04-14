import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "_tests_/e2e", // ← Only run E2E tests
  testMatch: ["**/*.spec.ts"], // ← Ensures Jest tests are ignored
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
