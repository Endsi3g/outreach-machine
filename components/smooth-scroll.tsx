"use client"

import { useEffect } from "react"

export function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: Event) => {
      const anchor = (e.currentTarget as HTMLAnchorElement)
      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("#")) return

      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        window.scrollTo({
          top: (target as HTMLElement).offsetTop,
          behavior: "smooth",
        })
      }
    }

    const anchors = document.querySelectorAll('a[href^="#"]')
    anchors.forEach((a) => a.addEventListener("click", handleClick))

    return () => {
      anchors.forEach((a) => a.removeEventListener("click", handleClick))
    }
  }, [])

  return null
}
