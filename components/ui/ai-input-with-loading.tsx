"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { IconSparkles, IconLoader2, IconArrowUp } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface AIInputWithLoadingProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isLoading: boolean
  placeholder?: string
}

export function AIInputWithLoading({
  value,
  onChange,
  onGenerate,
  isLoading,
  placeholder = "Décrivez ce que vous voulez générer...",
}: AIInputWithLoadingProps) {
  return (
    <div className="relative flex flex-col gap-2 rounded-xl border bg-background p-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
      <Textarea
        placeholder={placeholder}
        className="min-h-[100px] w-full resize-none border-0 bg-transparent p-3 focus-visible:ring-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onGenerate()
          }
        }}
      />
      <div className="flex items-center justify-between px-2 pb-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-primary">
              <IconLoader2 className="size-3 animate-spin" />
              L'IA réfléchit...
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <IconSparkles className="size-3" />
              Prêt à générer
            </div>
          )}
        </div>
        <Button
          size="icon"
          disabled={isLoading || !value.trim()}
          onClick={onGenerate}
          className={cn(
            "size-8 rounded-lg transition-all",
            isLoading ? "bg-primary/50" : "bg-primary"
          )}
        >
          {isLoading ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconArrowUp className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
