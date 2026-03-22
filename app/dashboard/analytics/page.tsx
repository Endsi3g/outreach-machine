"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { IconMail, IconEye, IconAlertCircle, IconTrendingUp } from "@tabler/icons-react"

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      if (!session?.user?.id) return
      try {
        const res = await fetch("/api/emails", {
          headers: { "x-user-id": session.user.id }
        })
        const json = await res.json()
        setData(json.emails || [])
      } catch (err) {
        console.error("Fetch stats error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [session?.user?.id])

  // Process data for charts
  const stats = React.useMemo(() => {
    const total = data.length
    const sent = data.filter(e => e.status === "sent" || e.status === "read").length
    const read = data.filter(e => e.status === "read").length
    const error = data.filter(e => e.status === "error").length
    
    // Volume by day (last 7 days)
    const dailyMap = new Map()
    data.forEach(e => {
      const date = new Date(e.created_at).toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
    })
    
    const chartData = Array.from(dailyMap.entries()).map(([name, value]) => ({ name, value })).reverse().slice(-7)

    const pieData = [
      { name: "Lu", value: read, color: "#10b981" },
      { name: "Envoyé", value: sent - read, color: "#3b82f6" },
      { name: "Erreur", value: error, color: "#ef4444" },
      { name: "En attente", value: total - sent - error, color: "#94a3b8" },
    ].filter(d => d.value > 0)

    return { total, sent, read, error, chartData, pieData }
  }, [data])

  if (loading) {
    return <div className="p-8 animate-pulse text-muted-foreground">Chargement des données...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytiques</h1>
        <p className="text-muted-foreground">Mesurez l&apos;impact de vos campagnes de prospection.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
            <IconMail className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sent}</div>
            <p className="text-xs text-muted-foreground">Sur {stats.total} générés</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux d&apos;Ouverture</CardTitle>
            <IconEye className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.sent > 0 ? ((stats.read / stats.sent) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{stats.read} emails lus</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux d&apos;Erreur</CardTitle>
            <IconAlertCircle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.sent > 0 ? ((stats.error / stats.sent) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{stats.error} échecs</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Croissance</CardTitle>
            <IconTrendingUp className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">VS mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="lg:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Volume d&apos;activité</CardTitle>
            <CardDescription>Emails générés au cours des 7 derniers jours.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--accent))', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Pie Chart */}
        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Répartition des statuts</CardTitle>
            <CardDescription>Performance globale de délivrabilité.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {stats.pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

