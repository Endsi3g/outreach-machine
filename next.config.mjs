import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["assets.aceternity.com", "images.unsplash.com"],
  },
}

export default withSentryConfig(nextConfig, {
  org: "uprising-studio",
  project: "outreach-machine",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  
  // NOTE: tunnelRoute: "/monitoring" is disabled because the proxy occasionally fails 
  // causing 10s ECONNRESET timeouts on all pages during dev/prod serverless execution.

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
