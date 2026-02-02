import { registerCommand } from "@crosshatch/util"
import { Atom, useAtom, useAtomMount } from "@effect-atom/atom-react"
import { Search as SearchIcon } from "lucide-react"
import { Button } from "./Button.tsx"
import { CommandDialog, CommandGroup, CommandInput, CommandList } from "./Command.tsx"
import { Separator } from "./Separator.tsx"
import { Sus } from "./Sus.tsx"

export const searchInputAtom = Atom.make("").pipe(Atom.keepAlive)

export const searchOpenAtom = Atom.make(false).pipe(Atom.keepAlive)

const searchInitAtom = Atom.make((get) => {
  get.addFinalizer(registerCommand(
    (e) => e.metaKey && e.key === "k",
    () => get.set(searchOpenAtom, !get(searchOpenAtom)),
  ))
})

export const Search = ({ results }: { results: React.ReactNode }) => {
  const [input, setInput] = useAtom(searchInputAtom)
  const [open, onOpenChange] = useAtom(searchOpenAtom)
  useAtomMount(searchInitAtom)

  return (
    <>
      <Button
        variant="outline"
        className="relative bg-background/25! py-2.75 border flex flex-1 justify-start rounded-md text-sm shadow-none"
        onClick={() => onOpenChange(true)}
      >
        <SearchIcon />
        <span className="inline-flex group-data-[collapsible=icon]:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.7rem] top-[0.7rem] hidden h-5 select-none group-data-[collapsible=icon]:hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs mt-[1px]">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog {...{ open, onOpenChange }}>
        <CommandInput
          placeholder="Search messages..."
          onValueChange={setInput}
          value={input}
        />
        {input.trim() && (
          <>
            <Separator />
            <CommandList>
              <CommandGroup>
                <Sus className="p-8">{results}</Sus>
              </CommandGroup>
            </CommandList>
          </>
        )}
      </CommandDialog>
    </>
  )
}
