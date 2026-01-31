import { chatAtom, chatItemsAtom } from "@/atoms"
import { ChatId } from "@/ids"
import { Route } from "@/routes/{-$chatId}"
import { cn } from "@crosshatch/ui/cn"
import { Message } from "@crosshatch/ui/components/Message"
import { Section, SectionInner } from "@crosshatch/ui/components/Section"
import { Skeleton } from "@crosshatch/ui/components/Skeleton"
import { useAtomSuspense, useAtomValue } from "@effect-atom/atom-react"
import { useEffect } from "react"

export const MessageList = () => {
  const { chatId } = Route.useParams()
  const { inflight } = useAtomValue(chatAtom(chatId))
  const { value: items } = useAtomSuspense(chatItemsAtom(
    chatId ? ChatId.make(chatId) : undefined,
  ))

  useEffect(() => {
    scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }, [items.length, inflight, chatId])

  return (
    <Section className="h-full p-2">
      <SectionInner className="space-y-4">
        {items.map((item) => {
          return (
            <ChatEventCard
              key={item.id}
              className={cn(
                "p-2",
                item.message.role === "user" && "justify-end",
              )}
            >
              {(() => {
                const { message } = item
                const inner = <Message {...{ message }} />
                switch (message.role) {
                  case "user": {
                    return <div className="p-4">{inner}</div>
                  }
                  case "assistant": {
                    return <div className="p-4 bg-gray-500/25">{inner}</div>
                  }
                  default: {
                    return <div />
                  }
                }
              })()}
            </ChatEventCard>
          )
        })}
        {inflight && (
          <ChatEventCard className="border-none p-2">
            <div className="relative">
              <Skeleton className="rounded-xs h-14 flex-1" />
            </div>
          </ChatEventCard>
        )}
      </SectionInner>
    </Section>
  )
}

export const ChatEventCard = ({ children, className, actions }: {
  children: React.ReactNode
  className?: string | undefined
  actions?: React.ReactNode | undefined
}) => (
  <div className={cn("w-full flex flex-row", className)}>
    <div className="w-2/3">
      <div className="rounded-sm border overflow-hidden">
        {children}
      </div>
      {actions && <div className="flex w-full">{actions}</div>}
    </div>
  </div>
)
