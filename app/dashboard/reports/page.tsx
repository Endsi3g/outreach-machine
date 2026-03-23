"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconFileAnalytics,
  IconDownload,
  IconLoader2,
  IconBuildingSkyscraper,
  IconMail,
  IconChartBar,
} from "@tabler/icons-react"
import { toast } from "sonner"

interface Report {
  id: string
  title: string
  type: "pipeline" | "campaign" | "icp"
  generatedAt: string
  data: any
}

export default function ReportsPage() {
  const [reports, setReports] = React.useState<Report[]>([])
  const [generating, setGenerating] = React.useState(false)

  const generatePipelineReport = async () => {
    setGenerating(true)

    // Fetch all data for the report
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetch("/api/leads").then(r => r.json()),
        fetch("/api/stats").then(r => r.json()),
      ])

      const leads = leadsRes.leads || []
      const stats = statsRes.stats || { leads: 0, emailsGenerated: 0, openRate: 0, replyRate: 0 }

      const report: Report = {
        id: `report_${Date.now()}`,
        title: `Rapport Pipeline — ${new Date().toLocaleDateString("fr-CA")}`,
        type: "pipeline",
        generatedAt: new Date().toISOString(),
        data: { leads, stats },
      }

      setReports(prev => [report, ...prev])
      toast.success("Rapport pipeline généré")
    } catch (error: any) {
      toast.error("Erreur de génération: " + error.message)
    } finally {
      setGenerating(false)
    }
  }

  const downloadReportAsPDF = (report: Report) => {
    // Generate HTML for PDF
    const leads = report.data.leads || []
    const stats = report.data.stats || {}

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #08345B; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 8px; color: #08345B; }
    h2 { font-size: 18px; margin: 24px 0 12px; color: #08345B; border-bottom: 2px solid #08345B; padding-bottom: 4px; }
    .subtitle { color: #666; font-size: 12px; margin-bottom: 24px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .stat { background: #f0f4f8; border-radius: 8px; padding: 16px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #08345B; }
    .stat-label { font-size: 11px; color: #666; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #08345B; color: white; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
    td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    tr:nth-child(even) { background: #f8fafc; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #999; text-align: center; }
    .logo { font-weight: 700; color: #08345B; font-size: 14px; }
  </style>
</head>
<body>
  <div class="logo">OUTREACH MACHINE</div>
  <p class="subtitle">Uprising Studio — Rapport généré le ${new Date().toLocaleDateString("fr-CA")} à ${new Date().toLocaleTimeString("fr-CA")}</p>
  <h1>${report.title}</h1>

  <h2>Statistiques Globales</h2>
  <div class="stats">
    <div class="stat"><div class="stat-value">${stats.leads || 0}</div><div class="stat-label">Leads Total</div></div>
    <div class="stat"><div class="stat-value">${stats.emailsGenerated || 0}</div><div class="stat-label">Emails Générés</div></div>
    <div class="stat"><div class="stat-value">${stats.openRate || 0}%</div><div class="stat-label">Taux d'Ouverture</div></div>
    <div class="stat"><div class="stat-value">${stats.replyRate || 0}%</div><div class="stat-label">Taux de Réponse</div></div>
  </div>

  <h2>Pipeline de Prospects (${leads.length})</h2>
  <table>
    <thead><tr><th>Nom</th><th>Email</th><th>Entreprise</th><th>Poste</th><th>Statut</th></tr></thead>
    <tbody>
      ${leads.length > 0 ? leads.map((l: any) => `
        <tr>
          <td>${l.name || '—'}</td>
          <td>${l.email || '—'}</td>
          <td>${l.company || '—'}</td>
          <td>${l.position || '—'}</td>
          <td>${l.status || 'new'}</td>
        </tr>
      `).join('') : '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999">Aucun lead dans le pipeline</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    Outreach Machine v5.0.0 — Uprising Studio Montréal<br/>
    Ce rapport est confidentiel et destiné uniquement à l'usage interne.
  </div>
</body>
</html>`

    // Open as printable page (user can Save as PDF via browser)
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, "_blank")
    if (win) {
      win.addEventListener("load", () => {
        win.print()
      })
    }
    toast.success("PDF ouvert dans un nouvel onglet. Utilisez Ctrl+P pour sauvegarder.")
  }

  const reportIcon = (type: string) => {
    switch (type) {
      case "pipeline": return <IconBuildingSkyscraper className="size-4 text-primary" />
      case "campaign": return <IconMail className="size-4 text-blue-500" />
      case "icp": return <IconChartBar className="size-4 text-green-500" />
      default: return <IconFileAnalytics className="size-4" />
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 animate-page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rapports</h1>
          <p className="text-sm text-muted-foreground">Générez des rapports PDF complets pour votre pipeline de prospection</p>
        </div>
      </div>

      {/* Generate buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary/30 transition-colors" onClick={generatePipelineReport}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <IconBuildingSkyscraper className="size-5 text-primary" />
              <CardTitle className="text-sm">Rapport Pipeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Rapport complet avec tous les leads, stats, et performance</p>
            <Button size="sm" className="mt-3 w-full" disabled={generating}>
              {generating ? <IconLoader2 className="mr-2 size-3 animate-spin" /> : <IconFileAnalytics className="mr-2 size-3" />}
              Générer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reports list */}
      {reports.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Rapports générés</h3>
          {reports.map((report) => (
            <Card key={report.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {reportIcon(report.type)}
                <div>
                  <p className="text-sm font-medium">{report.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Généré le {new Date(report.generatedAt).toLocaleString("fr-CA")}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => downloadReportAsPDF(report)}>
                <IconDownload className="mr-2 size-3" />
                Télécharger PDF
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
