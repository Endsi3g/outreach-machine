import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["assets.aceternity.com"],
  },
}

export default withSentryConfig(nextConfig, {
  org: "outreach-machine",
  project: "outreach-machine-app",
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
