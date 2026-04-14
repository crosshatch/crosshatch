import { Sus } from "@crosshatch/ui/components/Sus"
import { registerCommand } from "@crosshatch/util/registerCommand"
import { createFileRoute } from "@tanstack/react-router"
import { Struct } from "effect"
import { useEffect } from "react"

import { MessageList } from "@/components/MessageList"
import { router } from "@/router"

export const Route = createFileRoute("/{-$chatId}")({
  component: RouteComponent,
  params: {
    parse: Struct.evolve({
      chatId: (v) => v ?? undefined,
    }),
  },
})

function RouteComponent() {
  const { chatId } = Route.useParams()

  useEffect(() => {
    if (chatId) {
      const unsubscribe = registerCommand(
        (e) => e.metaKey && e.shiftKey && e.key === "o",
        () =>
          router.navigate({
            params: { chatId: undefined },
            to: "/{-$chatId}",
          }),
      )
      return unsubscribe
    }
    return
  }, [chatId])

  return (
    <Sus skeletonClassName="flex-1">
      <MessageList />
    </Sus>
  )
}
