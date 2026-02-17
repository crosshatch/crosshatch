import { Button } from "@crosshatch/ui/components/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@crosshatch/ui/components/Dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@crosshatch/ui/components/DropdownMenu"
import { Input } from "@crosshatch/ui/components/Input"
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@crosshatch/ui/components/Sidebar"
import { registerCommand } from "@crosshatch/util/registerCommand"
import { useAtomSet, useAtomSuspense } from "@effect-atom/atom-react"
import { Link } from "@tanstack/react-router"
import { MoreHorizontal, PencilLine, Plus, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { chatsAtom, deleteChatAtom, renameChatAtom } from "@/atoms/chat_atoms"
import { Search } from "@/components/Search"
import { chats } from "@/schema"

export const SidebarInner = () => {
  const { value: chats } = useAtomSuspense(chatsAtom)
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
      <SidebarHeader className="sticky top-0 right-0 left-0 z-50 border-b bg-secondary/75 backdrop-blur-sm">
        <Search />
      </SidebarHeader>
      <SidebarContent className="flex max-h-screen p-[0.5]">
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            <Button variant="outline" asChild className="h-8 justify-between font-light">
              <Link to="/{-$chatId}" params={{ chatId: undefined }}>
                New chat
                <Plus />
              </Link>
            </Button>
          </SidebarMenu>
          <SidebarMenu className="mt-2">
            {chats?.map((chat) => (
              <ChatLink key={chat.id} {...chat} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </div>
  )
}

const ChatLink = ({ title, id }: (typeof chats)["$inferSelect"]) => {
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
        <SidebarMenuButton className="h-8 rounded-sm px-2" asChild>
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
      </SidebarMenuItem>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
          <DialogDescription>Input the new title. Click save when you're done.</DialogDescription>
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
