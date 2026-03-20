import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Analytiques</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Performances</CardTitle>
          <CardDescription>
            Suivi des KPIs de vos campagnes d&apos;outreach.
          </CardDescription>
        </CardHeader>
        <div className="p-6 pt-0 text-sm text-muted-foreground">
          (Graphiques et données analytiques à implémenter ici)
        </div>
      </Card>
    </div>
  )
}
