"use client"

import type React from "react"
import {
  IconBrandGithub,
  IconBrandSlack,
  IconBrandFigma,
  IconBrandDiscord,
  IconBrandNotion,
  IconBrandStripe,
  IconBrandFramer,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface EffortlessIntegrationProps {
  /** Fixed width from Figma: 482px */
  width?: number | string
  /** Fixed height from Figma: 300px */
  height?: number | string
  /** Optional className to pass to root */
  className?: string
}

/**
 * Effortless Integration – Service integration constellation
 * Refactored to use Tailwind CSS and resolve inline style lint warnings.
 */
const EffortlessIntegration: React.FC<EffortlessIntegrationProps> = ({
  width = 482,
  height = 300,
  className = "",
}) => {
  const centerX = 250
  const centerY = 179

  const getPositionOnRing = (ringRadius: number, angle: number) => ({
    x: centerX + ringRadius * Math.cos(angle),
    y: centerY + ringRadius * Math.sin(angle),
  })

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width,
        height,
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10 pointer-events-none z-10" />

      {/* Outer ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-[#37322f]/20 opacity-80" />
      {/* Middle ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-[#37322f]/25 opacity-70" />
      {/* Inner ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-[#37322f]/30 opacity-60" />

      {/* Company logos positioned systematically on ring axes */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[358px]">
        {/* Central hub */}
        <div
          className="absolute w-[72px] h-[72px] bg-[#37322f] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] rounded-full flex items-center justify-center font-sans font-bold text-[32px] text-white"
          style={{ left: centerX - 36, top: centerY - 36 }}
        >
          b
        </div>

        {/* GitHub - 180° (left) */}
        <LogoItem
          x={getPositionOnRing(80, Math.PI).x - 16}
          y={getPositionOnRing(80, Math.PI).y - 16}
          bg="bg-black"
          icon={<IconBrandGithub className="w-[18px] h-[18px] text-white" />}
        />

        {/* Slack - 0° (right) */}
        <LogoItem
          x={getPositionOnRing(80, 0).x - 16}
          y={getPositionOnRing(80, 0).y - 16}
          bg="bg-white"
          icon={<IconBrandSlack className="w-[18px] h-[18px]" />}
        />

        {/* Figma - 315° (top-right) */}
        <LogoItem
          x={getPositionOnRing(120, -Math.PI / 4).x - 16}
          y={getPositionOnRing(120, -Math.PI / 4).y - 16}
          bg="bg-[#EEEFE8]"
          icon={<IconBrandFigma className="w-4 h-4" />}
        />

        {/* Discord - 135° (bottom-left) */}
        <LogoItem
          x={getPositionOnRing(120, (3 * Math.PI) / 4).x - 16}
          y={getPositionOnRing(120, (3 * Math.PI) / 4).y - 16}
          bg="bg-[#5865F2]"
          icon={<IconBrandDiscord className="w-[18px] h-[18px] text-white" />}
        />

        {/* Notion - 225° (bottom-left diagonal) */}
        <LogoItem
          x={getPositionOnRing(120, (5 * Math.PI) / 4).x - 16}
          y={getPositionOnRing(120, (5 * Math.PI) / 4).y - 16}
          bg="bg-white"
          icon={<IconBrandNotion className="w-[18px] h-[18px]" />}
        />

        {/* Stripe - 180° (left) */}
        <LogoItem
          x={getPositionOnRing(160, Math.PI).x - 16}
          y={getPositionOnRing(160, Math.PI).y - 16}
          bg="bg-[#635BFF]"
          icon={<IconBrandStripe className="w-[18px] h-[18px] text-white" />}
        />

        {/* Framer - 0° (right) */}
        <LogoItem
          x={getPositionOnRing(160, 0).x - 16}
          y={getPositionOnRing(160, 0).y - 16}
          bg="bg-black"
          icon={<IconBrandFramer className="w-4 h-4 text-white" />}
        />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(55, 50, 47, 0.1)" />
              <stop offset="50%" stopColor="rgba(55, 50, 47, 0.05)" />
              <stop offset="100%" stopColor="rgba(55, 50, 47, 0.1)" />
            </linearGradient>
          </defs>

          {/* Connection Lines */}
          {[
            { r: 80, a: 0 },
            { r: 80, a: Math.PI },
            { r: 120, a: -Math.PI / 4 },
            { r: 120, a: (3 * Math.PI) / 4 },
            { r: 120, a: (5 * Math.PI) / 4 },
            { r: 160, a: 0 },
            { r: 160, a: Math.PI },
          ].map((conn, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={getPositionOnRing(conn.r, conn.a).x}
              y2={getPositionOnRing(conn.r, conn.a).y}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              opacity={conn.r === 80 ? 0.2 : conn.r === 120 ? 0.15 : 0.1}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

function LogoItem({ x, y, bg, icon }: { x: number; y: number; bg: string; icon: React.ReactNode }) {
  return (
    <div
      className={cn(
        "absolute w-8 h-8 shadow-[0px_4px_12px_rgba(0,0,0,0.15)] rounded-full flex items-center justify-center",
        bg
      )}
      style={{ left: x, top: y }}
    >
      {icon}
    </div>
  )
}

export default EffortlessIntegration
