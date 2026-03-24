import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig() as any;

config.buildCommand = "pnpm run build-next";

config.default.bundling = {
  external: ["playwright-core", "chromium-bidi", "apify-client", "jose"],
};

export default config;
