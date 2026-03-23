/**
 * Web Agent — Prospect Research Scraper
 * Fetches and extracts structured data from prospect websites
 */

interface ProspectData {
  companyName: string
  description: string
  slogan: string | null
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
    return parseProspectHTML(html, url, response.headers)
  } catch (error: any) {
    return {
      companyName: extractDomain(url),
      description: `Impossible de récupérer les données: ${error.message}`,
      slogan: null,
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

function parseProspectHTML(html: string, url: string, headers?: Headers): ProspectData {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const companyName = titleMatch 
    ? titleMatch[1].replace(/\s*[-|–—]\s*.*/g, "").trim()
    : extractDomain(url)

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i) || 
                    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
                    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["'](.*?)["']/i);
  const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : "Aucune description trouvée";

  // Extract slogan (typically from the first or prominent H1 tag)
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let slogan = null;
  if (h1Match) {
    const rawSlogan = h1Match[1].replace(/<[^>]+>/g, '').trim();
    if (rawSlogan.length > 5 && rawSlogan.length < 100) {
      slogan = rawSlogan;
    }
  }

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

  // Detect technologies (enhanced heuristics)
  const techSet: Set<string> = new Set()
  
  if (headers) {
    const server = headers.get('server')?.toLowerCase() || ''
    const poweredBy = headers.get('x-powered-by')?.toLowerCase() || ''
    if (server.includes('cloudflare')) techSet.add('Cloudflare')
    if (server.includes('nginx')) techSet.add('Nginx')
    if (server.includes('vercel')) techSet.add('Vercel')
    if (poweredBy.includes('express')) techSet.add('Express')
    if (poweredBy.includes('php')) techSet.add('PHP')
    if (poweredBy.includes('next.js')) techSet.add('Next.js')
  }

  const generatorMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']*)["']/i) || 
                         html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']generator["']/i);
  if (generatorMatch) {
    techSet.add(generatorMatch[1].split(' ')[0].trim())
  }

  const htmlLower = html.toLowerCase()
  if (htmlLower.includes("wp-content") || htmlLower.includes("wordpress") || techSet.has("WordPress")) techSet.add("WordPress")
  if (htmlLower.includes("shopify")) techSet.add("Shopify")
  if (htmlLower.includes("wix.com") || htmlLower.includes("wix")) techSet.add("Wix")
  if (htmlLower.includes("squarespace")) techSet.add("Squarespace")
  if (htmlLower.includes("webflow") || html.includes("data-wf-site")) techSet.add("Webflow")
  
  if (html.includes("___gatsby")) techSet.add("Gatsby")
  if (html.includes("__NUXT__")) techSet.add("Nuxt.js")
  if (html.includes("_next/static") || html.includes("__NEXT") || techSet.has("Next.js")) techSet.add("Next.js")
  if (htmlLower.includes("react") || html.includes("data-reactroot")) techSet.add("React")
  if (htmlLower.includes("vue")) techSet.add("Vue.js")
  if (htmlLower.includes("svelte")) techSet.add("Svelte")
  if (htmlLower.includes("framer")) techSet.add("Framer")
  
  if (htmlLower.includes("googletagmanager") || html.includes("gtag")) techSet.add("Google Analytics")
  if (html.includes("js.stripe.com")) techSet.add("Stripe")
  if (html.includes("js.hs-scripts.com") || html.includes("hubspot")) techSet.add("HubSpot")
  if (htmlLower.includes("tailwind")) techSet.add("Tailwind CSS")

  const technologies = Array.from(techSet)

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
    "santé": "Santé / Médical",
    "clinique": "Santé / Médical",
    "avocat": "Juridique",
    "dentiste": "Soin dentaire",
    "fitness": "Fitness & Sport",
    "beauté": "Beauté & Bien-être",
    "mode": "Mode / Vêtements",
    "technologie": "Technologie (IT)",
    "finance": "Finance",
    "marketing": "Marketing & Publicité",
    "agence": "Agence Web / Création",
    "saas": "Logiciel (SaaS)",
    "software": "Logiciel (SaaS)",
    "e-commerce": "E-Commerce",
    "logistique": "Transport & Logistique",
    "automobile": "Automobile"
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
    slogan,
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
