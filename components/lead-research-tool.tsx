"use client"

import * as React from "react"
import { Search, Loader2, Send, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function LeadResearchTool() {
  const [target, setTarget] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<any>(null)

  const handleResearch = async () => {
    if (!target) {
      toast.error("Veuillez entrer un email ou un domaine.")
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche.")
      }

      const data = await response.json()
      setResult(data)
      
      if (data.qualification.isInteresting) {
        toast.success("Lead qualifié avec succès ! Notifications envoyées.")
      } else {
        toast.info("Recherche terminée : Lead non prioritaire.")
      }
    } catch (error) {
      toast.error("Erreur agent: " + (error instanceof Error ? error.message : "Inconnue"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          <CardTitle>Agentic Lead Research</CardTitle>
        </div>
        <CardDescription>
          Entrez un email ou un domaine pour lancer une recherche profonde via Exa.ai et qualification par Kimi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="ex: contact@uprisingstudio.com" 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && handleResearch()}
          />
          <Button onClick={handleResearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            {loading ? "Recherche..." : "Analyser"}
          </Button>
        </div>

        {result && (
          <div className="mt-6 border-t pt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Résultat du Lead</h4>
              <Badge variant={result.qualification.isInteresting ? "default" : "secondary"}>
                Score: {result.qualification.score}/100
              </Badge>
            </div>
            
            <div className="flex gap-3 items-start">
              {result.qualification.isInteresting ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-zinc-400 mt-0.5 shrink-0" />
              )}
              <div className="space-y-1">
                <p className="font-medium">{result.siteData.companyName || "Entreprise identifiée"}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.qualification.summary}</p>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg text-sm border">
              <p className="font-medium mb-1 flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                Raisonnement de l'agent
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 italic">"{result.qualification.reasoning}"</p>
            </div>

            {result.siteData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.siteData.technologies.slice(0, 5).map((tech: string) => (
                  <Badge key={tech} variant="outline" className="text-[10px] font-normal px-1.5 h-5 bg-zinc-100/50 dark:bg-white/5 border-none">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-[10px] text-muted-foreground flex justify-between border-t py-2 bg-zinc-50/50 dark:bg-white/5 rounded-b-xl">
        <span>Powered by Exa.ai + Kimi K2.5</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Notifications Email & Telegram actives
        </span>
      </CardFooter>
    </Card>
  )
}
