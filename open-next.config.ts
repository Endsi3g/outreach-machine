import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig() as any;

config.default.bundling = {
  external: ["playwright-core", "chromium-bidi"],
};

export default config;
