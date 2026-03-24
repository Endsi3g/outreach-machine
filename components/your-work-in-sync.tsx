"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface YourWorkInSyncProps {
  /** Fixed width from Figma: 482px */
  width?: number | string
  /** Fixed height from Figma: 300px */
  height?: number | string
  /** Optional className to pass to root */
  className?: string
  /** Theme palette */
  theme?: "light" | "dark"
}

/**
 * Your work, in sync – Chat conversation UI
 * Refactored to use Tailwind CSS to resolve inline style lint warnings.
 */
const YourWorkInSync: React.FC<YourWorkInSyncProps> = ({
  width = 482,
  height = 300,
  className = "",
  theme = "dark",
}) => {
  const isLight = theme === "light"

  // Figma-exported assets
  const imgAvatar1 = "/professional-woman-avatar-with-short-brown-hair-an.jpg"
  const imgAvatar2 = "/professional-man-avatar-with-beard-and-glasses-loo.jpg"
  const imgAvatar3 = "/professional-person-avatar-with-curly-hair-and-war.jpg"

  return (
    <div
      className={cn("relative bg-transparent", className)}
      style={{ width, height }}
      role="img"
      aria-label="Chat conversation showing team collaboration sync"
    >
      {/* Root frame size 482×300 – content centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[356px] h-[216px]">
        <div className="relative w-[356px] h-[216px] scale-[1.1]">
          {/* Message 1: Left side with avatar */}
          <div className="absolute left-0 top-0 flex gap-[10px] items-start w-[356px] h-[36px]">
            {/* Avatar */}
            <div
              className={cn(
                "w-9 h-9 rounded-full bg-cover bg-center border shrink-0",
                isLight ? "border-[rgba(0,0,0,0.08)]" : "border-[rgba(255,255,255,0.12)]"
              )}
              style={{ backgroundImage: `url('${imgAvatar1}')` }}
            />
            {/* Message bubble */}
            <div
              className={cn(
                "rounded-full px-3 h-9 flex items-center justify-center",
                isLight ? "bg-[#e8e5e3]" : "bg-[#374151]"
              )}
            >
              <span
                className={cn(
                  "font-sans font-medium text-[13px] tracking-[-0.4px] whitespace-nowrap",
                  isLight ? "text-[#37322f]" : "text-[#f9fafb]"
                )}
              >
                Team updates flow seamlessly
              </span>
            </div>
          </div>

          {/* Message 2: Right side with avatar */}
          <div className="absolute right-0 top-[60px] flex gap-[10px] items-start justify-end">
            {/* Message bubble */}
            <div
              className={cn(
                "rounded-full px-3 h-9 flex items-center justify-center",
                isLight ? "bg-[#37322f]" : "bg-[#111827]"
              )}
            >
              <span className="font-sans font-medium text-[13px] tracking-[-0.4px] text-white whitespace-nowrap">
                Hi everyone
              </span>
            </div>
            {/* Avatar */}
            <div
              className={cn(
                "w-9 h-9 rounded-full bg-cover bg-center border shrink-0",
                isLight ? "border-[rgba(0,0,0,0.08)]" : "border-[rgba(255,255,255,0.12)]"
              )}
              style={{ backgroundImage: `url('${imgAvatar2}')` }}
            />
          </div>

          {/* Message 3: Left side with avatar */}
          <div className="absolute left-0 top-[120px] flex gap-[10px] items-start w-[210px] h-[36px]">
            {/* Avatar */}
            <div
              className={cn(
                "w-9 h-9 rounded-full bg-cover bg-center border shrink-0",
                isLight ? "border-[rgba(0,0,0,0.08)]" : "border-[rgba(255,255,255,0.12)]"
              )}
              style={{ backgroundImage: `url('${imgAvatar3}')` }}
            />
            {/* Message bubble */}
            <div
              className={cn(
                "rounded-full px-3 h-9 flex items-center justify-center",
                isLight ? "bg-[#e8e5e3]" : "bg-[#374151]"
              )}
            >
              <span
                className={cn(
                  "font-sans font-medium text-[13px] tracking-[-0.4px] whitespace-nowrap",
                  isLight ? "text-[#37322f]" : "text-[#f9fafb]"
                )}
              >
                How about this instead?
              </span>
            </div>
          </div>

          {/* Message 4: Center with send button */}
          <div className="absolute left-[146px] top-[180px] flex gap-[10px] items-center h-[36px]">
            {/* Message bubble */}
            <div className="bg-white rounded-[16px] px-3 h-9 flex items-center justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_1px_2px_-0.4px_rgba(0,0,0,0.08)] overflow-hidden">
              <span className="font-sans font-normal text-sm text-[#030712] whitespace-nowrap">
                Great work, everyone!
              </span>
            </div>
            {/* Send button */}
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08)] cursor-pointer shrink-0",
                isLight ? "bg-[#37322f]" : "bg-[#111827]"
              )}
            >
              <ArrowUpIcon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}

export default YourWorkInSync
