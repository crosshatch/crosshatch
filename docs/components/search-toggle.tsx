import { cn } from "@crosshatch/ui/cn"
import { Button } from "@crosshatch/ui/components/button"
import { useI18n } from "fumadocs-ui/contexts/i18n"
import { useSearchContext } from "fumadocs-ui/contexts/search"
import { Search } from "lucide-react"

export const SearchToggleSm = () => {
  const { setOpenSearch } = useSearchContext()
  return (
    <Button
      variant="ghost"
      data-search=""
      aria-label="Open Search"
      size="icon"
      id="search-toggle-sm"
      onClick={() => {
        setOpenSearch(true)
      }}
    >
      <Search className="size-6 stroke-1" />
    </Button>
  )
}

export const SearchToggleLg = () => {
  const { hotKey, setOpenSearch } = useSearchContext()
  const { text } = useI18n()
  return (
    <Button
      data-search-full=""
      variant="outline"
      className="text-fd-muted-foreground transition-colors pl-2! pr-1.25! min-w-48"
      id="search-toggle-lg"
      onClick={() => setOpenSearch(true)}
    >
      <Search className="size-4" />
      {text.search}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd
            key={i}
            className={cn(
              "rounded-sm border bg-fd-background leading-none",
              i == 1 ? "text-[0.675rem] px-2 pt-1 pb-0.675" : "px-1.75 pt-1.25 pb-0.75",
            )}
          >
            {k.display}
          </kbd>
        ))}
      </div>
    </Button>
  )
}
