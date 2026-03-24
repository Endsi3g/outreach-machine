import { tool } from "ai";
import { z } from "zod";
import * as cheerio from "cheerio";

export const webScraperTool = tool({
  description: "Visits a webpage URL to extract the main text content. Highly useful to get information on a specific prospect or company.",
  parameters: z.object({
    url: z.string().describe("The full URL of the website to visit (e.g. https://example.com)"),
  }),
  execute: async ({ url }) => {
    let extractedText = "";
    
    // 1. Scraping ultra-rapide avec Fetch et Cheerio (Cloudflare compatible)
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        $("script, style, nav, footer, iframe, img, svg").remove();
        extractedText = $("body").text().replace(/\s+/g, " ").trim();
      }
    } catch (error) {
      console.log(`Fetch failed for ${url}:`, error);
      return `Failed to scrape website: HTTP request failed.`;
    }

    if (!extractedText || extractedText.length < 50) {
        return "Le contenu n'a pas pu être extrait. Le site bloque peut-être les robots ou nécessite du JavaScript.";
    }

    // Return max 5000 chars to be token efficient
    return extractedText.substring(0, 5000);
  },
});
