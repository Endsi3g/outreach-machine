import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="size-16 animate-pulse rounded-full bg-primary/10 flex items-center justify-center">
         <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-8 text-primary animate-bounce"
        >
          <path d="M12 2L20 20H4L12 2Z" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}
