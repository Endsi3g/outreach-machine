"use client"

import * as React from "react"
import { AgentPlan } from "@/components/ui/agent-plan"
import { Badge } from "@/components/ui/badge"
import { IconBrain } from "@tabler/icons-react"

export default function PlanningPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Agent Planning</h1>
        <Badge variant="outline" className="text-xs">
          <IconBrain className="mr-1 size-3" />
          IA Cognitive
        </Badge>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgentPlan />
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Statut de l'Agent</h3>
            <p className="text-sm text-muted-foreground mb-4">
              L'agent est actuellement en phase de réflexion intensive pour optimiser vos campagnes.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progression</span>
                <span>65%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] bg-primary transition-all duration-500" />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Mémoire de Travail</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-blue-500" />
                Dernière recherche : Trends SaaS 2024
              </li>
              <li className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-green-500" />
                Contexte chargé : 12 prospects
              </li>
              <li className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-yellow-500" />
                Modèle actif : Kimu 2.5
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
