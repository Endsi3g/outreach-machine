import { tool } from "ai";
import { z } from "zod";
import * as cheerio from "cheerio";

export const webScraperTool = tool({
  description: "Visits a webpage URL to extract the main text content. Highly useful to get information on a specific prospect or company.",
  parameters: z.object({
    url: z.string().describe("The full URL of the website to visit (e.g. https://example.com)"),
  }),
  execute: async ({ url }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove unnecessary elements
      $("script, style, nav, footer, iframe, img, svg").remove();

      const text = $("body").text().replace(/\s+/g, " ").trim();

      // Return max 5000 chars to be token efficient
      return text.substring(0, 5000);
    } catch (error: any) {
      return `Failed to scrape website: ${error.message}`;
    }
  },
});
