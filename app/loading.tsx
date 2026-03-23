export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spinner" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-semibold text-foreground">Outreach Machine</span>
          <span className="text-sm text-muted-foreground">Chargement en cours…</span>
        </div>
      </div>
    </div>
  )
}
