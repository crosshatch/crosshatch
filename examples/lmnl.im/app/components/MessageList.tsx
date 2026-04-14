import { cn } from "@crosshatch/ui/cn"
import { Message } from "@crosshatch/ui/components/Message"
import { Section, SectionInner } from "@crosshatch/ui/components/Section"
import { Skeleton } from "@crosshatch/ui/components/Skeleton"
import { useAtomSuspense, useAtomValue } from "@effect/atom-react"
import { Fragment, useEffect } from "react"

import { chatAtom, chatItemsAtom } from "@/atoms"
import { Route } from "@/routes/{-$chatId}"

export const MessageList = () => {
  const { chatId } = Route.useParams()
  const { inflight } = useAtomValue(chatAtom(chatId))
  const { value: items } = useAtomSuspense(chatItemsAtom((chatId ?? undefined) as never))

  useEffect(() => {
    scrollTo({
      behavior: "smooth",
      top: document.body.scrollHeight,
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
                  <ChatEventCard className="justify-end p-2">
                    <div className="min-w-0 p-4 break-all whitespace-normal">{inner}</div>
                  </ChatEventCard>
                  {inflight && i === items.length - 1 && (
                    <ChatEventCard className="border-none p-2">
                      <div className="relative">
                        <Skeleton className="h-14 flex-1 rounded-xs" />
                      </div>
                    </ChatEventCard>
                  )}
                </Fragment>
              )
            }
            case "assistant": {
              return (
                <ChatEventCard key={id} className="p-2">
                  <div className="min-w-0 bg-gray-500/25 p-4 break-all whitespace-normal">{inner}</div>
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

const ChatEventCard = ({
  children,
  className,
  actions,
}: {
  children: React.ReactNode
  className?: string | undefined
  actions?: React.ReactNode | undefined
}) => (
  <div className={cn("flex w-full flex-row", className)}>
    <div className="w-full min-w-0">
      <div className="overflow-hidden rounded-sm border">{children}</div>
      {actions && <div className="flex w-full">{actions}</div>}
    </div>
  </div>
)
