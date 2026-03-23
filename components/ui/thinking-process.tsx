import * as React from "react"
import { ChevronDown, ChevronRight, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"
// @ts-ignore
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ThinkingProcessProps {
  content: string
  isStreaming?: boolean
}

export function ThinkingProcess({ content, isStreaming = false }: ThinkingProcessProps) {
  const [isOpen, setIsOpen] = React.useState(true)

  if (!content) return null

  // If we're no longer streaming, auto-collapse the thinking process after a delay
  React.useEffect(() => {
    if (!isStreaming) {
      const timer = setTimeout(() => setIsOpen(false), 2000)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(true)
    }
  }, [isStreaming])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-4 rounded-lg border bg-muted/30 text-muted-foreground"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium hover:bg-muted/50">
        <div className="flex items-center gap-2">
          <BrainCircuit className={cn("size-4", isStreaming && "animate-pulse text-primary")} />
          <span>Processus de réflexion de l'IA {isStreaming ? "en cours..." : "terminé"}</span>
        </div>
        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed opacity-80">
          {content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function parseThinking(completion: string) {
  let thinkingText = null
  let finalContent = completion

  if (completion.includes('<think>')) {
    if (completion.includes('</think>')) {
      const parts = completion.split('</think>')
      thinkingText = parts[0].replace('<think>', '').trim()
      finalContent = parts.slice(1).join('</think>').trim()
    } else {
      // Still streaming the thinking part
      thinkingText = completion.replace('<think>', '').trim()
      finalContent = ''
    }
  }

  return { thinkingText, finalContent }
}
