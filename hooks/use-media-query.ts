import * as React from "react"

export function useMediaQuery() {
  const [device, setDevice] = React.useState<"mobile" | "tablet" | "desktop" | null>(null)

  React.useEffect(() => {
    const checkDevice = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        setDevice("mobile")
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        setDevice("tablet")
      } else {
        setDevice("desktop")
      }
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, [])

  return {
    device,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  }
}
