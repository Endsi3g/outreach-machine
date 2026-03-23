"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  IconBuildingSkyscraper,
  IconSearch,
  IconPlus,
  IconLoader2,
  IconWorld,
  IconUser,
  IconStarFilled,
  IconStar,
  IconRefresh,
} from "@tabler/icons-react"
import { toast } from "sonner"

interface Company {
  id: string
  name: string
  website: string
  industry: string
  location: string
  icpScore: number
  decisionMakers: DecisionMaker[]
  services: string[]
  technologies: string[]
  socialLinks: Record<string, string>
  lastResearched: string | null
}

interface DecisionMaker {
  name: string
  position: string
  email: string | null
  linkedin: string | null
}

const scoreColor = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-800 border-green-200"
  if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200"
  if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200"
  return "bg-red-100 text-red-800 border-red-200"
}

const scoreLabel = (score: number) => {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Bon"
  if (score >= 40) return "Moyen"
  return "Faible"
}

// ICP Scoring criteria for Uprising Studio (web agency)
function calculateICPScore(company: Partial<Company>): number {
  let score = 0

  // Has website (10pts)
  if (company.website) score += 10

  // Industry match (25pts)
  const highValueIndustries = ["restauration", "immobilier", "construction", "santé", "dentaire", "juridique", "beauté", "fitness"]
  if (company.industry && highValueIndustries.some(i => company.industry!.toLowerCase().includes(i))) score += 25

  // Located in QC (20pts)
  if (company.location && (company.location.toLowerCase().includes("montréal") || company.location.toLowerCase().includes("québec"))) score += 20

  // Uses outdated tech (15pts) = opportunity
  const outdatedTech = ["wordpress", "wix", "squarespace"]
  if (company.technologies?.some(t => outdatedTech.includes(t.toLowerCase()))) score += 15

  // Has contact info (15pts)
  if (company.decisionMakers?.some(dm => dm.email)) score += 15

  // Has social presence (10pts)
  if (company.socialLinks && Object.keys(company.socialLinks).length > 0) score += 10

  // Has decision makers (5pts)
  if (company.decisionMakers && company.decisionMakers.length > 0) score += 5

  return Math.min(score, 100)
}

export default function ScoringPage() {
  const [companies, setCompanies] = React.useState<Company[]>([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [researchUrl, setResearchUrl] = React.useState("")
  const [researching, setResearching] = React.useState(false)

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  const handleResearch = async () => {
    if (!researchUrl.trim()) return
    setResearching(true)

    try {
      let url = researchUrl.trim()
      if (!url.startsWith("http")) url = `https://${url}`

      const res = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const json = await res.json()
      if (json.data) {
        const newCompany: Company = {
          id: `company_${Date.now()}`,
          name: json.data.companyName || url,
          website: url,
          industry: json.data.industry || "Non déterminé",
          location: json.data.location || "Non déterminé",
          icpScore: 0,
          decisionMakers: json.data.contactEmail ? [{
            name: json.data.companyName,
            position: "Contact principal",
            email: json.data.contactEmail,
            linkedin: json.data.socialLinks?.linkedin || null,
          }] : [],
          services: json.data.services || [],
          technologies: json.data.technologies || [],
          socialLinks: json.data.socialLinks || {},
          lastResearched: new Date().toISOString(),
        }
        newCompany.icpScore = calculateICPScore(newCompany)

        setCompanies(prev => [newCompany, ...prev])
        setResearchUrl("")
        toast.success(`${newCompany.name} analysé — Score ICP: ${newCompany.icpScore}/100`)
      }
    } catch (error: any) {
      toast.error("Erreur de recherche: " + error.message)
    } finally {
      setResearching(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 animate-page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Scoring ICP</h1>
          <p className="text-sm text-muted-foreground">Analysez les entreprises et scorez-les selon votre ICP (Ideal Customer Profile)</p>
        </div>
      </div>

      {/* Research Bar */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <IconWorld className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Entrez l'URL du site web prospect (ex: restaurant-exemple.com)"
              value={researchUrl}
              onChange={(e) => setResearchUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleResearch} disabled={researching || !researchUrl.trim()}>
            {researching ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : <IconSearch className="mr-2 size-4" />}
            {researching ? "Analyse…" : "Analyser"}
          </Button>
        </div>
      </Card>

      {/* Search existing */}
      {companies.length > 0 && (
        <div className="relative w-full sm:w-64">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrer les entreprises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed border-2">
          <IconBuildingSkyscraper className="size-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-center">
            Aucune entreprise analysée.<br />
            <span className="text-sm">Entrez l&apos;URL d&apos;un site web prospect pour commencer l&apos;analyse ICP.</span>
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{company.name}</CardTitle>
                    <CardDescription className="text-xs">{company.website}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`text-xs font-semibold ${scoreColor(company.icpScore)}`}>
                    {company.icpScore}/100 — {scoreLabel(company.icpScore)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Industrie:</span> {company.industry}</div>
                  <div><span className="text-muted-foreground">Lieu:</span> {company.location}</div>
                </div>

                {company.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {company.technologies.map((t, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                )}

                {/* Decision Makers */}
                {company.decisionMakers.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Décideurs</p>
                    {company.decisionMakers.map((dm, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/50 px-2 py-1.5 text-xs">
                        <IconUser className="size-3 text-primary" />
                        <span className="font-medium">{dm.name}</span>
                        {dm.position && <span className="text-muted-foreground">— {dm.position}</span>}
                        {dm.email && <span className="ml-auto text-primary">{dm.email}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Score breakdown bar */}
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${company.icpScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
