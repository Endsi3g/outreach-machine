"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react"

interface PlanStep {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending"
}

interface AgentPlanProps {
  steps?: PlanStep[]
}

const defaultSteps: PlanStep[] = [
  {
    id: "1",
    title: "Analyse du profil lead",
    description: "Extraction des informations clés et du ton de communication du prospect.",
    status: "completed",
  },
  {
    id: "2",
    title: "Recherche de contexte",
    description: "Vérification des dernières actualités de l'entreprise sur LinkedIn et le web.",
    status: "completed",
  },
  {
    id: "3",
    title: "Rédaction personnalisée",
    description: "Génération de l'email en utilisant le framework AIDA et les points de douleur identifiés.",
    status: "in-progress",
  },
  {
    id: "4",
    title: "Optimisation du sujet",
    description: "A/B testing interne pour sélectionner l'objet avec le plus haut taux d'ouverture.",
    status: "pending",
  },
]

export function AgentPlan({ steps = defaultSteps }: AgentPlanProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plan d'Action de l'Agent</CardTitle>
            <CardDescription>Étapes suivies par l'IA pour cette génération</CardDescription>
          </div>
          <Badge variant="secondary" className="animate-pulse">
            En cours
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-4 last:pb-0">
            {index !== steps.length - 1 && (
              <div className="absolute left-[10px] top-[26px] h-[calc(100%-10px)] w-[2px] bg-muted" />
            )}
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
              {step.status === "completed" ? (
                <CheckCircle2 className="size-5 text-green-500" />
              ) : step.status === "in-progress" ? (
                <Clock className="size-5 text-primary animate-pulse" />
              ) : (
                <Circle className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{step.title}</span>
                {step.status === "in-progress" && (
                  <ArrowRight className="size-3 text-primary animate-bounce-x" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
