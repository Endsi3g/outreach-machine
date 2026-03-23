import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    bundling: {
        external: ["playwright-core", "chromium-bidi"],
    },
  },
};

export default config;
