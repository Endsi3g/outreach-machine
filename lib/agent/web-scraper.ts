/**
 * Web Agent — Prospect Research Scraper
 * Fetches and extracts structured data from prospect websites
 */

interface ProspectData {
  companyName: string
  description: string
  services: string[]
  contactEmail: string | null
  phone: string | null
  socialLinks: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  technologies: string[]
  industry: string
  location: string | null
}

/**
 * Extract structured prospect data from a website URL
 */
export async function researchProspect(url: string): Promise<ProspectData> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OutreachMachine/1.0; +https://uprisingstudio.com)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    return parseProspectHTML(html, url)
  } catch (error: any) {
    return {
      companyName: extractDomain(url),
      description: `Impossible de récupérer les données: ${error.message}`,
      services: [],
      contactEmail: null,
      phone: null,
      socialLinks: {},
      technologies: [],
      industry: "Non déterminé",
      location: null,
    }
  }
}

function parseProspectHTML(html: string, url: string): ProspectData {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is)
  const companyName = titleMatch 
    ? titleMatch[1].replace(/\s*[-|–—]\s*.*/g, "").trim()
    : extractDomain(url)

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/is)
  const description = descMatch ? descMatch[1].trim() : ""

  // Extract emails
  const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  const contactEmail = emailMatches
    ? emailMatches.find(e => !e.includes("example") && !e.includes("test")) || null
    : null

  // Extract phone numbers
  const phoneMatch = html.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g)
  const phone = phoneMatch ? phoneMatch[0] : null

  // Extract social links
  const socialLinks: ProspectData["socialLinks"] = {}
  const linkedinMatch = html.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s"']*/i)
  if (linkedinMatch) socialLinks.linkedin = linkedinMatch[0]
  const twitterMatch = html.match(/https?:\/\/(www\.)?(twitter|x)\.com\/[^\s"']*/i)
  if (twitterMatch) socialLinks.twitter = twitterMatch[0]
  const facebookMatch = html.match(/https?:\/\/(www\.)?facebook\.com\/[^\s"']*/i)
  if (facebookMatch) socialLinks.facebook = facebookMatch[0]
  const instagramMatch = html.match(/https?:\/\/(www\.)?instagram\.com\/[^\s"']*/i)
  if (instagramMatch) socialLinks.instagram = instagramMatch[0]

  // Detect technologies (basic heuristics)
  const technologies: string[] = []
  if (html.includes("wp-content") || html.includes("wordpress")) technologies.push("WordPress")
  if (html.includes("shopify")) technologies.push("Shopify")
  if (html.includes("next") || html.includes("__NEXT")) technologies.push("Next.js")
  if (html.includes("react")) technologies.push("React")
  if (html.includes("vue")) technologies.push("Vue.js")
  if (html.includes("framer")) technologies.push("Framer")
  if (html.includes("wix")) technologies.push("Wix")
  if (html.includes("squarespace")) technologies.push("Squarespace")

  // Extract services from text (basic keyword detection)
  const services: string[] = []
  const textContent = html.replace(/<[^>]+>/g, " ").toLowerCase()
  const serviceKeywords = [
    "développement web", "web development", "design", "marketing",
    "seo", "consulting", "e-commerce", "automatisation", "branding",
    "stratégie digitale", "réseaux sociaux", "publicité"
  ]
  for (const kw of serviceKeywords) {
    if (textContent.includes(kw)) services.push(kw)
  }

  // Detect industry
  const industryKeywords: Record<string, string> = {
    "restaurant": "Restauration",
    "immobilier": "Immobilier",
    "construction": "Construction",
    "santé": "Santé",
    "avocat": "Juridique",
    "dentiste": "Dentaire",
    "fitness": "Fitness",
    "beauté": "Beauté",
    "mode": "Mode",
    "technologie": "Technologie",
    "finance": "Finance",
  }
  let industry = "Non déterminé"
  for (const [keyword, label] of Object.entries(industryKeywords)) {
    if (textContent.includes(keyword)) {
      industry = label
      break
    }
  }

  // Extract location
  const locationMatch = textContent.match(/montréal|québec|toronto|ottawa|vancouver|laval|longueuil|sherbrooke/i)
  const location = locationMatch ? locationMatch[0].charAt(0).toUpperCase() + locationMatch[0].slice(1) : null

  return {
    companyName,
    description,
    services,
    contactEmail,
    phone,
    socialLinks,
    technologies,
    industry,
    location,
  }
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, "").split(".")[0]
  } catch {
    return url
  }
}

/**
 * Batch research multiple prospect URLs
 */
export async function researchMultipleProspects(
  urls: string[]
): Promise<{ url: string; data: ProspectData }[]> {
  const results = await Promise.allSettled(
    urls.map(async (url) => ({
      url,
      data: await researchProspect(url),
    }))
  )

  return results
    .filter((r): r is PromiseFulfilledResult<{ url: string; data: ProspectData }> => r.status === "fulfilled")
    .map((r) => r.value)
}
