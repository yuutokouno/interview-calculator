// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  reporter: [["list"], ["github"]],
  use: {
    baseURL: "http://localhost:8787",
  },
  webServer: {
    command: "npx serve -l 8787 --no-clipboard",
    port: 8787,
    reuseExistingServer: false,
  },
});
