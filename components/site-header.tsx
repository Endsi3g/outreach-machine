"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationsPanel } from "@/components/notifications-panel"
import { ModelSelector } from "@/components/ui/model-selector"
import { IconPlus, IconInbox, IconLoader2 } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

const pageNames: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/leads": "Leads & Entreprises",
  "/dashboard/scoring": "Scoring ICP",
  "/dashboard/generate": "Génération IA",
  "/dashboard/assistant": "Assistant IA",
  "/dashboard/planification": "Planification",
  "/dashboard/review": "Révision des emails",
  "/dashboard/campaigns": "Campagnes",
  "/dashboard/ab-testing": "A/B Testing",
  "/dashboard/reports": "Rapports",
  "/dashboard/analytics": "Analytiques",
  "/dashboard/team": "Équipe",
  "/dashboard/settings": "Paramètres",
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [showQuickCreate, setShowQuickCreate] = React.useState(false)
  const [quickType, setQuickType] = React.useState("")
  const [quickLoading, setQuickLoading] = React.useState(false)

  const currentPage = pageNames[pathname] || "Vue d'ensemble"

  const quickCreateOptions = [
    { label: "Nouveau lead", action: () => router.push("/dashboard/leads") },
    { label: "Générer un email", action: () => router.push("/dashboard/generate") },
    { label: "Nouvelle campagne", action: () => router.push("/dashboard/campaigns") },
    { label: "Planifier un envoi", action: () => router.push("/dashboard/planification") },
  ]

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentPage}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModelSelector className="hidden md:flex" />
          {/* Quick Create Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickCreate(!showQuickCreate)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <IconPlus className="size-3.5" />
              Création rapide
            </button>
            {showQuickCreate && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowQuickCreate(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border bg-card p-1 shadow-lg animate-fade-in-up">
                  {quickCreateOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { opt.action(); setShowQuickCreate(false) }}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <NotificationsPanel />
        </div>
      </div>
    </header>
  )
}
