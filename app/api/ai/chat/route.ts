import { NextRequest, NextResponse } from "next/server"
import { conversationalChat } from "@/lib/ai/kimi"
import { auth } from "@/auth"

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

    const response = await conversationalChat(history, message)

    return NextResponse.json({ response, model: "kimi-k2.5" })
  } catch (error: any) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur de chat IA" },
      { status: 500 }
    )
  }
}
