"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [displayChildren, setDisplayChildren] = React.useState(children)
  const prevPathname = React.useRef(pathname)

  React.useEffect(() => {
    if (prevPathname.current !== pathname) {
      // New page — trigger transition
      setIsTransitioning(true)

      // Brief delay for the exit animation
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
        prevPathname.current = pathname
      }, 150)

      return () => clearTimeout(timer)
    } else {
      // Same page, update immediately
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <>
      {/* Loading bar at top */}
      {isTransitioning && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-primary/20">
          <div className="h-full bg-primary animate-progress-bar rounded-full" />
        </div>
      )}
      <div
        className={`transition-opacity duration-150 ease-in-out ${
          isTransitioning ? "opacity-40" : "opacity-100"
        }`}
      >
        {displayChildren}
      </div>
    </>
  )
}
