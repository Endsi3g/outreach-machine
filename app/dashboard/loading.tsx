export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 animate-page-enter">
      {/* Section Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[180px] rounded-xl animate-shimmer" />
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="px-4 lg:px-6">
        <div className="h-[400px] w-full rounded-xl animate-shimmer" />
      </div>
      {/* Table skeleton */}
      <div className="px-4 lg:px-6">
        <div className="h-[300px] w-full rounded-xl animate-shimmer" />
      </div>
    </div>
  )
}
