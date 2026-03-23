"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useModelStore } from "@/hooks/use-model-store"

const models = [
  {
    value: "kimi:k2-5",
    label: "Kimi 2.5",
  },
  {
    value: "deepseek-r1",
    label: "DeepSeek",
  },
  {
    value: "llama3",
    label: "Llama 3",
  },
]

export function ModelSelector({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const { selectedModel, setSelectedModel } = useModelStore()

  // Use a derived state for the currently rendered label to avoid hydration mismatch if needed
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[160px] justify-between", className)}
        >
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          {mounted 
            ? models.find((model) => model.value === selectedModel)?.label || "Select model..."
            : "Chargement..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList>
            <CommandEmpty>Aucun modèle trouvé.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={(currentValue) => {
                    setSelectedModel(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedModel === model.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {model.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
