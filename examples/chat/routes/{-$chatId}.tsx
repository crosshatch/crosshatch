import { MessageList } from "@/components/message-list"
import { ChatId } from "@/ids"
import { router } from "@/router"
import { LoaderView } from "@crosshatch/ui/components/loader-view"
import { registerCommand } from "@crosshatch/util"
import { createFileRoute } from "@tanstack/react-router"
import { Struct } from "effect"
import { Suspense, useEffect } from "react"

export const Route = createFileRoute("/{-$chatId}")({
  component: RouteComponent,
  params: {
    parse: Struct.evolve({
      chatId: (v) => v ? ChatId.make(v) : undefined,
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
            to: "/{-$chatId}",
            params: { chatId: undefined },
          }),
      )
      return unsubscribe
    }
    return
  }, [chatId])

  return (
    <Suspense fallback={<LoaderView />}>
      <MessageList />
    </Suspense>
  )
}
