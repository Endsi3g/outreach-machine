"use client"

import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useCompletion } from "@ai-sdk/react"
import {
  IconSparkles,
  IconLoader2,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react"

export default function GeneratePage() {
  const [leadName, setLeadName] = React.useState("")
  const [leadCompany, setLeadCompany] = React.useState("")
  const [leadPosition, setLeadPosition] = React.useState("")
  const [campaignSubject, setCampaignSubject] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  const { completion, isLoading, complete, error } = useCompletion({
    api: "/api/ai/generate",
  })

  const handleGenerate = async () => {
    await complete("", {
      body: {
        leadName,
        leadCompany,
        leadPosition,
        campaignSubject,
        tone: "professionnel et amical",
        language: "français",
      },
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(completion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Générer</h1>
        <Badge variant="outline" className="text-xs">
          <IconSparkles className="mr-1 size-3" />
          Ollama IA
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du lead</CardTitle>
            <CardDescription>
              Renseignez les informations du destinataire pour générer un email personnalisé.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4 px-6 pb-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadName">Nom du contact</Label>
              <Input
                id="leadName"
                placeholder="Jean Dupont"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadCompany">Entreprise</Label>
              <Input
                id="leadCompany"
                placeholder="Acme Corp"
                value={leadCompany}
                onChange={(e) => setLeadCompany(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadPosition">Poste</Label>
              <Input
                id="leadPosition"
                placeholder="Directeur Marketing"
                value={leadPosition}
                onChange={(e) => setLeadPosition(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="campaignSubject">Sujet de la campagne</Label>
              <Input
                id="campaignSubject"
                placeholder="Collaboration SaaS"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="mt-2 w-full"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 size-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <IconSparkles className="mr-2 size-4" />
                  Générer l&apos;email
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aperçu</CardTitle>
                <CardDescription>
                  L&apos;email généré par l&apos;IA apparaîtra ici.
                </CardDescription>
              </div>
              {completion && (
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <IconCheck className="size-4 text-green-600" />
                  ) : (
                    <IconCopy className="size-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <div className="px-6 pb-6">
            {error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
                {error.message || "Erreur de génération. Vérifiez qu'Ollama est lancé (ollama serve)."}
              </div>
            ) : completion ? (
              <div className="space-y-4 whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
                {completion}
              </div>
            ) : (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                {isLoading
                  ? "Génération en cours..."
                  : "Remplissez le formulaire et cliquez sur Générer"}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
