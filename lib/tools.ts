import { tool } from "ai";
import { z } from "zod";
import * as cheerio from "cheerio";
import { chromium } from "playwright";

export const webScraperTool = tool({
  description: "Visits a webpage URL to extract the main text content. Highly useful to get information on a specific prospect or company.",
  parameters: z.object({
    url: z.string().describe("The full URL of the website to visit (e.g. https://example.com)"),
  }),
  execute: async ({ url }) => {
    let extractedText = "";
    
    // 1. Essai ultra-rapide avec Fetch et Cheerio
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
      console.log(`Fetch failed for ${url}, trying Playwright fallback...`);
    }

    // 2. Fallback Playwright si le texte est très court (ex: SPA React/Vue) ou si Fetch a échoué (Cloudflare)
    if (extractedText.length < 150) {
      console.log(`Using Playwright fallback for ${url} (length: ${extractedText.length})...`);
      try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        });
        const page = await context.newPage();
        
        // Aller à l'URL et attendre que le réseau se calme pour que les requêtes JS se terminent
        await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
        
        // Récupérer tout le texte visible
        extractedText = await page.evaluate(() => document.body.innerText);
        await browser.close();
        
        extractedText = extractedText.replace(/\s+/g, " ").trim();
      } catch (fallbackError: any) {
        return `Failed to scrape website even with Playwright: ${fallbackError.message}`;
      }
    }

    // Return max 5000 chars to be token efficient
    return extractedText.substring(0, 5000) || "Aucun contenu textuel n'a pu être extrait du site.";
  },
});
