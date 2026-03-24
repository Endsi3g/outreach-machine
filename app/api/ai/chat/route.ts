import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { generateText } from "ai"
import { ollama } from "ollama-ai-provider"
import { emailTools } from "@/lib/agent/email-tools"

const KIMI_MODEL = process.env.KIMI_MODEL || "kimi-k2.5"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { history = [], message } = body

    if (!message) {
      return NextResponse.json({ error: "Le message est requis" }, { status: 400 })
    }

    const { text, toolCalls, toolResults } = await generateText({
      model: ollama(KIMI_MODEL),
      system: `Tu es un copilote d'opérations par email pour les équipes en phase de démarrage.
      Workflows principaux:
      1) Envoyer un email d'intro: rédige une approche concise et appelle send_intro_email.
      2) Consulter la boîte de réception: appelle read_inbox quand l'utilisateur demande à vérifier les réponses.
      3) Répondre automatiquement: appelle auto_reply pour répondre à un message entrant.
      Règles:
      - Garde les réponses concises et axées sur l'exécution.
      - Ne pas inventer de faits clients.
      - Si une information manque, pose une seule question ciblée.
      - Après chaque appel d'outil réussi, réponds avec une courte ligne de statut.
      Réponds toujours en français.`,
      messages: [
        ...history,
        { role: "user", content: message }
      ],
      tools: emailTools,
      maxSteps: 5, // Allow the agent to call tools and respond
    })

    return NextResponse.json({ 
      response: text, 
      toolCalls,
      toolResults,
      model: KIMI_MODEL 
    })
  } catch (error: any) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur de chat IA" },
      { status: 500 }
    )
  }
}
