import { NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { getOllamaModel } from "@/lib/ollama"
import { rateLimit } from "@/lib/rate-limit"

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
    const { leadName, leadCompany, leadPosition, campaignSubject, tone, language } =
      await request.json()

    const prompt = `Tu es un expert en emails de prospection B2B. Génère un email personnalisé et engageant.

Destinataire :
- Nom : ${leadName || "le contact"}
- Entreprise : ${leadCompany || "l'entreprise"}
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
      prompt,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez qu'Ollama est lancé." },
      { status: 500 }
    )
  }
}
