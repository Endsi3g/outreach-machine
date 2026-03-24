"use client"

import type React from "react"
import { IconVideo, IconCalendarEvent } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface SmartSimpleBrilliantProps {
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
 * Smart · Simple · Brilliant – Calendar cards
 * Refactored to use Tailwind CSS to resolve inline style lint warnings.
 */
const SmartSimpleBrilliant: React.FC<SmartSimpleBrilliantProps> = ({
  width = 482,
  height = 300,
  className = "",
  theme = "dark",
}) => {
  const isLight = theme === "light"

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-transparent",
        className
      )}
      style={{ width, height }}
      role="img"
      aria-label="Two calendar cards with colored event rows"
    >
      <div className="relative w-[295.297px] h-[212.272px] scale-[1.2]">
        {/* Left tilted card group */}
        <div className="absolute left-[123.248px] top-0 w-0 h-0">
          <div className="rotate-[5deg] origin-center">
            <div
              className={cn(
                "w-[155.25px] rounded-[9px] p-[6px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_2px_4px_rgba(0,0,0,0.07)]",
                isLight ? "bg-white" : "bg-[#333937]"
              )}
            >
              {/* Amber event */}
              <div className="w-full h-[51px] rounded-[4px] overflow-hidden bg-amber-500/10 flex">
                <div className="w-[2.25px] bg-[#F59E0B]" />
                <div className="p-[4.5px] w-full">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-sans font-medium text-[9px] text-[#92400E]">2:00</span>
                    <span className="font-sans font-medium text-[9px] text-[#92400E]">PM</span>
                    <div className="bg-[#92400E] p-[1.5px] rounded-full">
                      <div className="w-2 h-2 overflow-hidden relative">
                        <IconVideo className="text-white w-full h-full" stroke={2} />
                      </div>
                    </div>
                  </div>
                  <div className="font-sans font-bold text-[9px] text-[#92400E]">
                    1:1 with Heather
                  </div>
                </div>
              </div>

              {/* Sky event */}
              <div className="w-full h-[79.5px] rounded-[4px] overflow-hidden bg-sky-500/10 mt-[3px] flex">
                <div className="w-[2.25px] bg-[#0EA5E9]" />
                <div className="p-[4.5px] w-full">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-sans font-medium text-[9px] text-[#0C4A6E]">2:00</span>
                    <span className="font-sans font-medium text-[9px] text-[#0C4A6E]">PM</span>
                    <div className="bg-[#0C4A6E] p-[1.5px] rounded-full">
                      <div className="w-2 h-2 overflow-hidden relative">
                        <IconCalendarEvent className="text-white w-full h-full" stroke={2} />
                      </div>
                    </div>
                  </div>
                  <div className="font-sans font-bold text-[9px] text-[#0C4A6E]">
                    Concept Design Review II
                  </div>
                </div>
              </div>

              {/* Emerald event */}
              <div className="w-full h-[51px] rounded-[4px] overflow-hidden bg-emerald-500/10 mt-[3px] flex">
                <div className="w-[2.25px] bg-[#10B981]" />
                <div className="p-[4.5px] w-full">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-sans font-medium text-[9px] text-[#064E3B]">9:00</span>
                    <span className="font-sans font-medium text-[9px] text-[#064E3B]">AM</span>
                  </div>
                  <div className="font-sans font-bold text-[9px] text-[#064E3B]">
                    Webinar: Figma ...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="absolute left-0 top-[6.075px] w-[155.25px]">
          <div className="-rotate-[5deg] origin-center">
            <div
              className={cn(
                "w-[155.25px] rounded-[9px] p-[6px] shadow-[-8px_6px_11.3px_rgba(0,0,0,0.12),0px_0px_0px_1px_rgba(0,0,0,0.08),0px_2px_4px_rgba(0,0,0,0.06)]",
                isLight ? "bg-white" : "bg-[#333937]"
              )}
            >
              {/* Violet event */}
              <div className="w-full h-[51px] rounded-[4px] overflow-hidden bg-violet-500/10 flex">
                <div className="w-[2.25px] bg-[#8B5CF6]" />
                <div className="p-[4.5px] w-full">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-sans font-medium text-[9px] text-[#581C87]">11:00</span>
                    <span className="font-sans font-medium text-[9px] text-[#581C87]">AM</span>
                    <div className="bg-[#581C87] p-[1.5px] rounded-full">
                      <div className="w-2 h-2 overflow-hidden relative">
                        <IconVideo className="text-white w-full h-full" stroke={2} />
                      </div>
                    </div>
                  </div>
                  <div className="font-sans font-bold text-[9px] text-[#581C87]">
                    Onboarding Presentation
                  </div>
                </div>
              </div>

              {/* Rose event */}
              <div className="w-full h-[51px] rounded-[4px] overflow-hidden bg-rose-100 flex mt-[3px]">
                <div className="w-[2.25px] bg-[#F43F5E]" />
                <div className="p-[4.5px] w-full">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-sans font-medium text-[9px] text-[#BE123C]">4:00</span>
                    <span className="font-sans font-medium text-[9px] text-[#BE123C]">PM</span>
                    <div className="bg-[#BE123C] p-[1.5px] rounded-full">
                      <div className="w-2 h-2 overflow-hidden relative">
                        <IconVideo className="text-white w-full h-full" stroke={2} />
                      </div>
                    </div>
                  </div>
                  <div className="font-sans font-bold text-[9px] text-[#BE123C]">
                    🍷 Happy Hour
                  </div>
                </div>
              </div>

              {/* Violet tall event */}
              <div className="w-full h-[79.5px] rounded-[4px] overflow-hidden bg-violet-500/10 flex mt-[3px]">
                <div className="w-[2.25px] bg-[#8B5CF6]" />
                <div className="p-[4.5px] w-full">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-sans font-medium text-[9px] text-[#581C87]">11:00</span>
                    <span className="font-sans font-medium text-[9px] text-[#581C87]">AM</span>
                  </div>
                  <div className="font-sans font-bold text-[9px] text-[#581C87]">
                    🍔 New Employee Welcome Lunch!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartSimpleBrilliant
