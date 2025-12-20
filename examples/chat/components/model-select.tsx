import { currentModelIdAtom, modelIdsAtom } from "@/atoms"
import { cn } from "@crosshatch/ui/cn"
import { Button } from "@crosshatch/ui/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@crosshatch/ui/components/command"
import { Popover, PopoverContent, PopoverTrigger } from "@crosshatch/ui/components/popover"
import { Result, useAtom, useAtomValue } from "@effect-atom/atom-react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

export const ModelSelect = () => {
  const [open, setOpen] = useState(false)
  const modelIdsResult = useAtomValue(modelIdsAtom)
  const [selected, setSelected] = useAtom(currentModelIdAtom)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between rounded-full"
        >
          {Result
            .builder(modelIdsResult)
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
                        setOpen(false)
                      }}
                    >
                      {model}
                      <Check className={cn("ml-auto", model === selected ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))
                )
                .orElse(() => undefined)}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
