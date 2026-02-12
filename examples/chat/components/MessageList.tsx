import { chatAtom, chatItemsAtom } from "@/atoms/chat_atoms"
import { ChatId } from "@/ids"
import { Route } from "@/routes/{-$chatId}"
import { cn } from "@crosshatch/ui/cn"
import { Message } from "@crosshatch/ui/components/Message"
import { Section, SectionInner } from "@crosshatch/ui/components/Section"
import { Skeleton } from "@crosshatch/ui/components/Skeleton"
import { useAtomSuspense, useAtomValue } from "@effect-atom/atom-react"
import { Fragment, useEffect } from "react"

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
      <SectionInner className="min-w-0">
        {items.map((item, i) => {
          const { message, id } = item
          const inner = <Message {...{ message }} />
          switch (message.role) {
            case "user": {
              return (
                <Fragment key={id}>
                  <ChatEventCard className="p-2 justify-end">
                    <div className="p-4 min-w-0 break-all whitespace-normal">{inner}</div>
                  </ChatEventCard>
                  {inflight && i === items.length - 1 && (
                    <ChatEventCard className="border-none p-2">
                      <div className="relative">
                        <Skeleton className="rounded-xs h-14 flex-1" />
                      </div>
                    </ChatEventCard>
                  )}
                </Fragment>
              )
            }
            case "assistant": {
              return (
                <ChatEventCard key={id} className="p-2">
                  <div className="p-4 bg-gray-500/25 min-w-0 break-all whitespace-normal">{inner}</div>
                </ChatEventCard>
              )
            }
            default: {
              return <div key={id} />
            }
          }
        })}
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
    <div className="min-w-0 w-full">
      <div className="rounded-sm border overflow-hidden">
        {children}
      </div>
      {actions && <div className="flex w-full">{actions}</div>}
    </div>
  </div>
)
