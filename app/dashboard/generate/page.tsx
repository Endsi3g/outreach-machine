"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TextShimmer } from "@/components/ui/text-shimmer"
import { Skeleton } from "@/components/ui/skeleton"
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading"
import { AgentPlan } from "@/components/ui/agent-plan"

export default function GeneratePage() {
  const [leadName, setLeadName] = React.useState("")
  const [leadCompany, setLeadCompany] = React.useState("")
  const [leadPosition, setLeadPosition] = React.useState("")
  const [campaignSubject, setCampaignSubject] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  const { completion, isLoading, complete, error } = useCompletion({
    api: "/api/chat/generate",
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
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Description de l&apos;email</CardTitle>
              <CardDescription>
                Utilisez l&apos;IA pour générer un email basé sur vos besoins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIInputWithLoading
                value={leadName + " " + leadCompany + " " + leadPosition + " " + campaignSubject}
                onChange={(val) => {
                  // This is a simplified integration. For a real app, 
                  // we might want a single prompt box instead of multiple inputs.
                  setCampaignSubject(val)
                }}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                placeholder="Ex: Écris un email pour Jean de Acme Corp qui est Directeur Marketing pour lui proposer une collaboration SaaS..."
              />
            </CardContent>
          </Card>

          {isLoading && <AgentPlan />}

          <Card>
            <CardHeader>
              <CardTitle>Informations détaillées (Optionnel)</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-4 px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="leadName">Nom</Label>
                  <Input
                    id="leadName"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="leadCompany">Entreprise</Label>
                  <Input
                    id="leadCompany"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <Card className="h-fit">
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
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground p-8">
                {isLoading ? (
                  <div className="w-full space-y-4">
                    <TextShimmer className="text-lg font-medium text-primary">
                      Génération par l'IA en cours...
                    </TextShimmer>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[95%]" />
                    <Skeleton className="h-4 w-[80%]" />
                  </div>
                ) : (
                  "Remplissez le formulaire et cliquez sur Générer"
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
