"use client"

import dynamic from "next/dynamic"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Skeleton } from "@/components/ui/skeleton"
import { LeadResearchTool } from "@/components/lead-research-tool"

import data from "./data.json"

// Lazy load the chart component to improve initial page load performance
const ChartAreaInteractive = dynamic(
  () => import("@/components/chart-area-interactive").then((mod) => mod.ChartAreaInteractive),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-xl" />
  }
)

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        <div className="lg:col-span-2">
          <ChartAreaInteractive />
        </div>
        <div>
          <LeadResearchTool />
        </div>
      </div>
      <DataTable data={data} />
    </div>
  )
}
