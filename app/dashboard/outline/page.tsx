"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  IconPlus, 
  IconColumns, 
  IconDots, 
  IconFileText, 
  IconUsers, 
  IconHistory,
  IconGripVertical
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "outline", label: "Outline" },
  { id: "performance", label: "Past Performance", count: 3 },
  { id: "personnel", label: "Key Personnel", count: 2 },
  { id: "documents", label: "Focus Documents" },
]

export default function OutlinePage() {
  const [activeTab, setActiveTab] = React.useState("outline")

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center bg-orange-50/50 p-1.5 rounded-full border border-orange-100/50 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                activeTab === tab.id 
                  ? "bg-white text-orange-950 shadow-sm ring-1 ring-black/5" 
                  : "text-orange-900/60 hover:text-orange-900 hover:bg-white/50"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="flex items-center justify-center size-5 rounded-full bg-orange-100 text-[10px] font-bold text-orange-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-orange-100 text-orange-950 hover:bg-orange-50 gap-2 font-medium">
            <IconColumns className="size-4" />
            Customize Columns
          </Button>
          <Button size="sm" className="h-10 px-4 rounded-xl bg-orange-900 hover:bg-orange-950 text-white gap-2 font-medium">
            <IconPlus className="size-4" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Main Builder Area (The "Dashed" box from image) */}
      <div className="flex-1 rounded-[32px] border-2 border-dashed border-orange-100/50 bg-white/30 backdrop-blur-md p-10 flex flex-col items-center justify-center text-center">
        {/* Three Columns Placeholder as requested */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { title: "Structure", icon: IconHistory, color: "text-blue-500" },
            { title: "Collaborateurs", icon: IconUsers, color: "text-purple-500" },
            { title: "Documents", icon: IconFileText, color: "text-orange-500" }
          ].map((col, i) => (
            <div key={i} className="group relative bg-white/60 p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4">
              <div className={cn("p-4 rounded-2xl bg-white shadow-inner", col.color)}>
                <col.icon className="size-8" />
              </div>
              <h3 className="font-semibold text-orange-950">{col.title}</h3>
              <p className="text-xs text-orange-900/40">Gérez vos {col.title.toLowerCase()} ici.</p>
              
              {/* Drag handles and dots for premium feel */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconGripVertical className="size-4 text-orange-200 cursor-grab" />
                <IconDots className="size-4 text-orange-300 cursor-pointer" />
              </div>

              {/* Fake lines content */}
              <div className="w-full space-y-2 mt-4">
                <div className="h-2 w-3/4 bg-orange-50 rounded-full mx-auto" />
                <div className="h-2 w-1/2 bg-orange-50 rounded-full mx-auto" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-md">
          <p className="text-orange-900/50 mb-6 leading-relaxed">
            Commencez à construire votre structure d&apos;outreach personnalisée. 
            Importez des modèles ou créez vos sections de zéro.
          </p>
          <Button variant="link" className="text-orange-700 font-semibold p-0 h-auto gap-2">
            Voir la documentation <IconFileText className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
