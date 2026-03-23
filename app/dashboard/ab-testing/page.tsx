"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  IconAB2,
  IconPlus,
  IconLoader2,
  IconChartBar,
  IconTrash,
  IconPlayerPlay,
  IconCheck,
} from "@tabler/icons-react"
import { toast } from "sonner"

interface ABTest {
  id: string
  name: string
  status: "draft" | "running" | "completed"
  variantA: { subject: string; body: string; sent: number; opened: number; replied: number }
  variantB: { subject: string; body: string; sent: number; opened: number; replied: number }
  winner: "A" | "B" | null
  createdAt: string
}

export default function ABTestingPage() {
  const [tests, setTests] = React.useState<ABTest[]>([])
  const [showCreate, setShowCreate] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    subjectA: "",
    bodyA: "",
    subjectB: "",
    bodyB: "",
  })

  const createTest = () => {
    if (!form.name || !form.subjectA || !form.subjectB) {
      toast.error("Le nom et les sujets des deux variants sont requis")
      return
    }

    const newTest: ABTest = {
      id: `ab_${Date.now()}`,
      name: form.name,
      status: "draft",
      variantA: { subject: form.subjectA, body: form.bodyA, sent: 0, opened: 0, replied: 0 },
      variantB: { subject: form.subjectB, body: form.bodyB, sent: 0, opened: 0, replied: 0 },
      winner: null,
      createdAt: new Date().toISOString(),
    }
    setTests(prev => [newTest, ...prev])
    setForm({ name: "", subjectA: "", bodyA: "", subjectB: "", bodyB: "" })
    setShowCreate(false)
    toast.success("Test A/B créé")
  }

  const startTest = (id: string) => {
    setTests(prev => prev.map(t => {
      if (t.id !== id) return t
      // Simulate sending with random results
      const sentA = Math.floor(Math.random() * 50) + 10
      const sentB = Math.floor(Math.random() * 50) + 10
      const openedA = Math.floor(sentA * (Math.random() * 0.5 + 0.1))
      const openedB = Math.floor(sentB * (Math.random() * 0.5 + 0.1))
      const repliedA = Math.floor(openedA * (Math.random() * 0.3))
      const repliedB = Math.floor(openedB * (Math.random() * 0.3))

      const rateA = sentA > 0 ? (openedA / sentA) : 0
      const rateB = sentB > 0 ? (openedB / sentB) : 0

      return {
        ...t,
        status: "completed" as const,
        variantA: { ...t.variantA, sent: sentA, opened: openedA, replied: repliedA },
        variantB: { ...t.variantB, sent: sentB, opened: openedB, replied: repliedB },
        winner: rateA >= rateB ? "A" as const : "B" as const,
      }
    }))
    toast.success("Test A/B lancé et complété")
  }

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id))
  }

  const rate = (opened: number, sent: number) => sent > 0 ? ((opened / sent) * 100).toFixed(1) : "0"

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 animate-page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">A/B Testing</h1>
          <p className="text-sm text-muted-foreground">Testez vos emails pour maximiser les taux d&apos;ouverture et de réponse</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus className="mr-2 size-4" />
          Nouveau test
        </Button>
      </div>

      {showCreate && (
        <Card className="p-4 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Créer un test A/B</h3>
            <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
          </div>
          <Input placeholder="Nom du test" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-600">Variant A</p>
              <Input placeholder="Sujet A" value={form.subjectA} onChange={(e) => setForm(p => ({ ...p, subjectA: e.target.value }))} />
              <textarea placeholder="Corps de l'email A" value={form.bodyA} onChange={(e) => setForm(p => ({ ...p, bodyA: e.target.value }))} className="w-full h-20 rounded-lg border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-600">Variant B</p>
              <Input placeholder="Sujet B" value={form.subjectB} onChange={(e) => setForm(p => ({ ...p, subjectB: e.target.value }))} />
              <textarea placeholder="Corps de l'email B" value={form.bodyB} onChange={(e) => setForm(p => ({ ...p, bodyB: e.target.value }))} className="w-full h-20 rounded-lg border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <Button onClick={createTest}>
            <IconAB2 className="mr-2 size-4" />
            Créer le test
          </Button>
        </Card>
      )}

      {tests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed border-2">
          <IconAB2 className="size-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-center">
            Aucun test A/B.<br />
            <span className="text-sm">Créez un test pour comparer deux versions d&apos;un email.</span>
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{test.name}</CardTitle>
                    <Badge variant="outline" className={
                      test.status === "completed" ? "bg-green-100 text-green-800" :
                      test.status === "running" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {test.status === "completed" ? "Terminé" : test.status === "running" ? "En cours" : "Brouillon"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {test.status === "draft" && (
                      <Button size="sm" variant="outline" onClick={() => startTest(test.id)}>
                        <IconPlayerPlay className="mr-1 size-3" /> Lancer
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteTest(test.id)} className="text-muted-foreground hover:text-destructive">
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "A", variant: test.variantA, color: "blue", isWinner: test.winner === "A" },
                    { label: "B", variant: test.variantB, color: "orange", isWinner: test.winner === "B" },
                  ].map(({ label, variant, color, isWinner }) => (
                    <div key={label} className={`rounded-lg border p-3 space-y-2 ${isWinner ? "ring-2 ring-green-500 bg-green-50/50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold text-${color}-600`}>Variant {label}</span>
                        {isWinner && <Badge className="text-[10px] bg-green-600 text-white"><IconCheck className="size-2.5 mr-0.5" /> Gagnant</Badge>}
                      </div>
                      <p className="text-sm font-medium">{variant.subject || "—"}</p>
                      {test.status === "completed" && (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold">{variant.sent}</p>
                            <p className="text-[10px] text-muted-foreground">Envoyés</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{rate(variant.opened, variant.sent)}%</p>
                            <p className="text-[10px] text-muted-foreground">Ouverture</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{rate(variant.replied, variant.sent)}%</p>
                            <p className="text-[10px] text-muted-foreground">Réponse</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
