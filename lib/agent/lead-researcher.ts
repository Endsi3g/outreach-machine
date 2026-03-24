import { researchProspect } from "./web-scraper"
import { searchExa, researchEntity } from "./exa"
import { chatWithKimi } from "@/lib/ai/kimi"
import { notifyLeadResearch } from "@/lib/notifications/notifier"

interface LeadQualification {
  score: number
  reasoning: string
  summary: string
  isInteresting: boolean
}

/**
 * Lead Research Agent
 * Orchestrates search, scraping, qualification, and notification
 */
export async function runLeadResearchAgent(target: string, userEmail?: string) {
  console.log(`🚀 Starting Lead Research Agent for: ${target}`)

  // 1. Research via Exa.ai (Deep Web Research)
  const webResearch = await researchEntity(target)

  // 2. Scrape Website (Structured Data)
  // If target is an email, extract domain. If it's a domain, use it.
  const domain = target.includes("@") ? target.split("@")[1] : target
  const url = domain.startsWith("http") ? domain : `https://${domain}`
  const siteData = await researchProspect(url)

  // 3. Lead Qualification via AI
  const prompt = `Tu es un expert en qualification de prospects (Lead Qualification).
Analyse les données suivantes sur un prospect et détermine s'ils sont un bon fit pour une agence web qui propose du design, du développement, de l'automatisation IA et du SEO.

DONNÉES WEB (EXA):
${webResearch}

DONNÉES DU SITE (SCRAPER):
Nom: ${siteData.companyName}
Description: ${siteData.description}
Technologies: ${siteData.technologies.join(", ")}
Industrie: ${siteData.industry}
Localisation: ${siteData.location}

INSTRUCTIONS:
Retourne un objet JSON avec:
- score: (0-100)
- reasoning: (explication concise en français)
- summary: (résumé du profil)
- isInteresting: (boolean, true si score > 70)

RETOURNE UNIQUEMENT LE JSON.`

  const qualificationRaw = await chatWithKimi([
    { role: "system", content: "Tu es un agent de qualification de leads très précis. Réponds uniquement en format JSON." },
    { role: "user", content: prompt }
  ])

  let qualification: LeadQualification
  try {
    // Basic cleanup in case of markdown blocks
    const jsonStr = qualificationRaw.replace(/```json|```/g, "").trim()
    qualification = JSON.parse(jsonStr)
  } catch (e) {
    console.error("Failed to parse qualification JSON:", qualificationRaw)
    qualification = {
      score: 50,
      reasoning: "Erreur lors de l'analyse automatique.",
      summary: "Données brutes disponibles mais non structurées.",
      isInteresting: false
    }
  }

  // 4. Notifications
  if (qualification.isInteresting) {
    await notifyLeadResearch({
      title: `Nouveau Prospect Qualifié: ${siteData.companyName || target}`,
      message: `Score: ${qualification.score}/100\n\n${qualification.reasoning}\n\n${qualification.summary}`,
      emailTo: userEmail,
      data: {
        domain,
        qualification,
        siteData,
        technicalStack: siteData.technologies
      }
    })
  } else {
    console.log(`Lead disqualified (Score: ${qualification.score})`)
  }

  return { target, qualification, siteData }
}
