"use client"

import { Demo } from "@/components/ui/demo"
import { Card } from "@/components/ui/card"

export default function DemoPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Démo UI</h1>
      </div>
      <Card className="min-h-[700px] overflow-hidden">
        <Demo />
      </Card>
    </div>
  )
}
