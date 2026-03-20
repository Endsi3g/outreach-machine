import { ApifyClient } from "apify-client"

const apifyToken = process.env.APIFY_API_TOKEN || ""

/**
 * Apify client for running web scraping actors.
 */
export const apifyClient = new ApifyClient({
  token: apifyToken,
})
