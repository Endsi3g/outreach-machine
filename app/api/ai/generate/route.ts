import { NextRequest, NextResponse } from "next/server"
import { generateEmail } from "@/lib/ai/kimi"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { prospectName, companyName, companyInfo, services, tone, customPrompt } = body

    if (!prospectName || !companyName) {
      return NextResponse.json(
        { error: "prospectName et companyName sont requis" },
        { status: 400 }
      )
    }

    const email = await generateEmail({
      prospectName,
      companyName,
      companyInfo,
      services,
      tone,
      customPrompt,
    })

    return NextResponse.json({ email, model: "kimi-k2.5" })
  } catch (error: any) {
    console.error("AI generate error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur de génération IA" },
      { status: 500 }
    )
  }
}
