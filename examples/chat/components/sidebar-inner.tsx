import { chatsAtom, deleteChatAtom, renameChatAtom, runtime } from "@/atoms"
import { Drizzle } from "@/Drizzle"
import { router } from "@/router"
import { chatItems, chats, embeddings } from "@/schema"
import { Button } from "@crosshatch/ui/components/button"
import { CommandItem } from "@crosshatch/ui/components/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@crosshatch/ui/components/dialog"
import { DialogTitle } from "@crosshatch/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@crosshatch/ui/components/dropdown-menu"
import { Input } from "@crosshatch/ui/components/input"
import { Message } from "@crosshatch/ui/components/message"
import { Search, searchInputAtom, searchOpenAtom } from "@crosshatch/ui/components/search"
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@crosshatch/ui/components/sidebar"
import { Skeleton } from "@crosshatch/ui/components/skeleton"
import { embed, registerCommand } from "@crosshatch/util"
import { useAtomSet, useAtomSuspense } from "@effect-atom/atom-react"
import { Atom } from "@effect-atom/atom-react"
import { Link } from "@tanstack/react-router"
import { cosineDistance, eq } from "drizzle-orm"
import { Effect } from "effect"
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export const SidebarInner = () => {
  const { value: chats } = useAtomSuspense(chatsAtom)
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll">
      <SidebarHeader className="sticky top-0 right-0 left-0 border-b bg-secondary/75 z-50 backdrop-blur-sm">
        <Search results={<SearchResults />} />
      </SidebarHeader>
      <SidebarContent className="flex [&::-webkit-scrollbar]:hidden max-h-screen p-[0.5]">
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            {chats?.map((chat) => <ChatLink key={chat.id} {...chat} />)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </div>
  )
}

const searchResultsAtom = runtime.atom(Effect.fn(function*(get) {
  const text = get(searchInputAtom)
  if (!text) return []
  const embedding = yield* embed(text)
  const _ = yield* Drizzle
  return yield* _
    .select({
      id: chatItems.id,
      chatId: chatItems.chatId,
      message: chatItems.message,
      similarity: cosineDistance(embeddings.embedding, embedding),
      title: chats.title,
    })
    .from(chatItems)
    .innerJoin(embeddings, eq(embeddings.chatItemId, chatItems.id))
    .leftJoin(chats, eq(chatItems.chatId, chats.id))
    .orderBy((fields) => fields.similarity)
    .limit(5)
})).pipe(
  Atom.debounce("250  millis"),
  Atom.keepAlive,
)

const SearchResults = () => {
  const { value: items } = useAtomSuspense(searchResultsAtom)
  const setSearchOpen = useAtomSet(searchOpenAtom)
  return items.map(({ id, title, message, chatId }) => {
    return (
      <CommandItem
        key={id}
        value={id}
        onSelect={() => {
          setSearchOpen(false)
          router.navigate({
            to: "/{-$chatId}",
            params: { chatId },
          })
        }}
      >
        <div className="flex flex-col">
          <span className="text-lg">{title}</span>
          <Message {...{ message }} />
        </div>
      </CommandItem>
    )
  })
}

const ChatLink = ({ title, id }: typeof chats["$inferSelect"]) => {
  const unnamed = useRef(title === undefined)
  const renameChat = useAtomSet(renameChatAtom)
  const [newTitle, setNewTitle] = useState(title ?? "")
  useEffect(() => {
    if (unnamed.current && title) {
      setNewTitle(title)
      unnamed.current = false
    }
  }, [title])
  const deleteChat = useAtomSet(deleteChatAtom)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const unsubscribe = registerCommand(
      (e) => e.metaKey && e.key === "Enter",
      () => {
        renameChat({
          id,
          title: newTitle,
        })
        setOpen(false)
      },
    )
    return unsubscribe
  })
  return (
    <Dialog {...{ open }} onOpenChange={setOpen}>
      <SidebarMenuItem>
        {!title ? <Skeleton className="h-8 p-0 rounded-sm" /> : (
          <>
            <SidebarMenuButton className="px-2 h-8 rounded-sm" asChild>
              <Link
                activeProps={{ className: "bg-primary/15 hover:bg-primary/15!" }}
                to="/{-$chatId}"
                params={{ chatId: id }}
              >
                <span className="font-light">{title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                <>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <PencilLine className="text-muted-foreground" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem onClick={() => deleteChat(id)}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete chat</span>
                  </DropdownMenuItem>
                </>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </SidebarMenuItem>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
          <DialogDescription>
            Input the new title. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Input value={newTitle} onChange={({ target: { value } }) => setNewTitle(value)} />
        <Button
          variant="outline"
          size="sm"
          disabled={newTitle === title}
          onClick={() => {
            renameChat({ id, title: newTitle })
            setOpen(false)
          }}
        >
          Save title
        </Button>
      </DialogContent>
    </Dialog>
  )
}
