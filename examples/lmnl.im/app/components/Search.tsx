import { Button } from "@crosshatch/ui/components/Button"
import { CommandDialog, CommandGroup, CommandInput, CommandList } from "@crosshatch/ui/components/Command"
import { CommandItem } from "@crosshatch/ui/components/Command"
import { Message } from "@crosshatch/ui/components/Message"
import { Separator } from "@crosshatch/ui/components/Separator"
import { Sus } from "@crosshatch/ui/components/Sus"
import { registerCommand } from "@crosshatch/util/registerCommand"
import { Atom, useAtom, useAtomMount, useAtomSet, useAtomSuspense } from "@effect-atom/atom-react"
import { EmbeddingModel } from "@effect/ai"
import { cosineDistance, eq } from "drizzle-orm"
import { Effect } from "effect"
import { Search as SearchIcon } from "lucide-react"

import { Drizzle } from "@/Drizzle"
import { router } from "@/router"
import { runtime } from "@/runtime"
import { chatItems, chats, embeddings } from "@/schema"

export const searchInputAtom = Atom.make("").pipe(Atom.keepAlive)

export const searchOpenAtom = Atom.make(false).pipe(Atom.keepAlive)

const searchInitAtom = Atom.make((get) => {
  get.addFinalizer(
    registerCommand(
      (e) => e.metaKey && e.key === "k",
      () => get.set(searchOpenAtom, !get(searchOpenAtom)),
    ),
  )
})

export const Search = () => {
  const [input, setInput] = useAtom(searchInputAtom)
  const [open, onOpenChange] = useAtom(searchOpenAtom)
  useAtomMount(searchInitAtom)
  return (
    <>
      <Button
        variant="outline"
        className="relative flex flex-1 justify-start rounded-md border border-primary/7.5! bg-background/25! py-2.75 text-sm shadow-none"
        onClick={() => onOpenChange(true)}
      >
        <SearchIcon />
        <span className="inline-flex group-data-[collapsible=icon]:hidden">Search...</span>
        <kbd className="pointer-events-none absolute top-[0.7rem] right-[0.7rem] hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none group-data-[collapsible=icon]:hidden sm:flex">
          <span className="mt-px text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog {...{ onOpenChange, open }}>
        <CommandInput placeholder="Search messages..." onValueChange={setInput} value={input} />
        {input.trim() && (
          <>
            <Separator />
            <CommandList>
              <CommandGroup>
                <Sus skeletonClassName="min-h-70 rounded-md">
                  <SearchResults />
                </Sus>
              </CommandGroup>
            </CommandList>
          </>
        )}
      </CommandDialog>
    </>
  )
}

const searchResultsAtom = runtime
  .atom(
    Effect.fn(function* (get) {
      const text = get(searchInputAtom)
      if (!text) return []
      const em = yield* EmbeddingModel.EmbeddingModel
      const embedding = yield* em.embed(text)
      const _ = yield* Drizzle
      const distance = cosineDistance(embeddings.embedding, embedding)
      return yield* Effect.tryPromise(() =>
        _.select({
          chatId: chatItems.chatId,
          id: chatItems.id,
          message: chatItems.message,
          title: chats.title,
        })
          .from(chatItems)
          .innerJoin(embeddings, eq(embeddings.chatItemId, chatItems.id))
          .leftJoin(chats, eq(chatItems.chatId, chats.id))
          .orderBy(distance)
          .limit(5),
      )
    }),
  )
  .pipe(Atom.debounce("250 millis"), Atom.keepAlive)

const SearchResults = () => {
  const { value: items } = useAtomSuspense(searchResultsAtom)
  const setSearchOpen = useAtomSet(searchOpenAtom)
  return items.map(({ id, title, message, chatId }) => {
    return (
      <CommandItem
        className="p-2!"
        key={id}
        value={id}
        onSelect={() => {
          setSearchOpen(false)
          router.navigate({
            params: { chatId },
            to: "/{-$chatId}",
          })
        }}
      >
        <div className="flex flex-col">
          <span className="text-md">{title}</span>
          <Message {...{ message }} />
        </div>
      </CommandItem>
    )
  })
}
