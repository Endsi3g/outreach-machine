import { NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { getOllamaModel } from "@/lib/ollama"
import { rateLimit } from "@/lib/rate-limit"
import { webScraperTool } from "@/lib/tools"
import { KIMU_SYSTEM_PROMPT } from "@/lib/templates"

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success } = rateLimit(ip, { maxTokens: 5, refillRate: 1 })
  if (!success) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans quelques secondes." },
      { status: 429 }
    )
  }

  try {
    const { leadName, leadCompany, leadPosition, leadWebsite, campaignSubject, tone, language } =
      await request.json()

    const prompt = `Génère un email de prospection selon les instructions suivantes.

Destinataire :
- Nom : ${leadName || "le contact"}
- Entreprise : ${leadCompany || "l'entreprise"}
- Site Web : ${leadWebsite || "Non fourni"}
- Poste : ${leadPosition || ""}

Campagne :
- Sujet : ${campaignSubject || "Collaboration potentielle"}
- Ton : ${tone || "professionnel et amical"}
- Langue : ${language || "français"}

Règles :
- Maximum 150 mots
- Accroche personnalisée
- Proposition de valeur claire
- Call-to-action spécifique
- Pas de langage commercial agressif
- Signature : [Votre nom]

Génère uniquement le corps de l'email (pas d'objet).`

    const model = getOllamaModel()

    const result = streamText({
      model,
      system: KIMU_SYSTEM_PROMPT,
      prompt,
      tools: {
        webScraperTool,
      },
      maxSteps: 2, // Allow the model to call the tool and then generate the email
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez qu'Ollama est lancé." },
      { status: 500 }
    )
  }
}
