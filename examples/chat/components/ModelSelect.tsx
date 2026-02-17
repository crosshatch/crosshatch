import { cn } from "@crosshatch/ui/cn"
import { Button } from "@crosshatch/ui/components/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@crosshatch/ui/components/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@crosshatch/ui/components/Popover"
import { Result, useAtom, useAtomValue } from "@effect-atom/atom-react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

import { currentModelIdAtom, modelIdsAtom } from "@/atoms/ai_atoms"

export const ModelSelect = () => {
  const [open, onOpenChange] = useState(false)
  const modelIdsResult = useAtomValue(modelIdsAtom)
  const [selected, setSelected] = useAtom(currentModelIdAtom)
  return (
    <Popover {...{ onOpenChange, open }}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between rounded-full">
          {Result.builder(modelIdsResult)
            .onSuccess((models) => models.find((model) => model === selected))
            .onInitialOrWaiting(() => "Loading models...")
            .orElse(() => "Failed to load models")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search models..." className="h-9" />
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            <CommandGroup>
              {Result.builder(modelIdsResult)
                .onSuccess((models) =>
                  models.map((model) => (
                    <CommandItem
                      key={model}
                      value={model}
                      onSelect={(currentValue) => {
                        setSelected(currentValue)
                        onOpenChange(false)
                      }}
                    >
                      {model}
                      <Check className={cn("ml-auto", model === selected ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  )),
                )
                .orElse(() => undefined)}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
