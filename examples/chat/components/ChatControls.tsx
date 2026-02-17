import { Button } from "@crosshatch/ui/components/Button"
import { Dialog, DialogContent, DialogTrigger } from "@crosshatch/ui/components/Dialog"
import { Section, SectionInner } from "@crosshatch/ui/components/Section"
import { Sus } from "@crosshatch/ui/components/Sus"
import { Textarea } from "@crosshatch/ui/components/Textarea"
import { useAtom, useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { ArrowUp, PocketKnife } from "lucide-react"
import { useEffect, useRef } from "react"

import { modelIdsAtom } from "@/atoms/ai_atoms"
import { chatAtom } from "@/atoms/chat_atoms"
import { sendMessageAtom } from "@/atoms/sendMessageAtom"
import { ModelSelect } from "@/components/ModelSelect"
import { Route } from "@/routes/{-$chatId}"

export const ChatControls = () => {
  const { chatId } = Route.useParams()
  const sendMessage = useAtomSet(sendMessageAtom)
  const [chat, setChat] = useAtom(chatAtom(chatId))
  const { inflight, text } = chat
  const ref = useRef<HTMLTextAreaElement>(null)
  const modelIdsLoaded = useAtomValue(modelIdsAtom)._tag === "Success"
  useEffect(() => ref?.current?.focus(), [chatId])
  return (
    <Section className="sticky right-0 bottom-0 left-0 border-t bg-background/90 p-4 backdrop-blur-lg">
      <SectionInner className="space-y-2">
        <Textarea
          ref={ref}
          value={text}
          onChange={({ target: { value } }) =>
            setChat({
              ...chat,
              text: value,
            })
          }
          placeholder="Your message..."
          className="min-h-30 w-full resize-none rounded-2xl border p-4 text-primary shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === "Enter") {
              e.preventDefault()
              sendMessage(chatId)
            }
          }}
        />
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-row gap-2">
            <Sus skeletonClassName="flex items-center gap-2 w-36 h-9 rounded-full">
              <ModelSelect />
            </Sus>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="size-9 cursor-pointer rounded-full" variant="outline">
                  <PocketKnife className="stroke-1" size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent>TODO</DialogContent>
            </Dialog>
          </div>
          <Button
            onClick={() => (inflight ? inflight.abort() : sendMessage(chatId))}
            size="icon"
            className="size-9 cursor-pointer rounded-full"
            variant="outline"
            disabled={!(text || inflight) || !modelIdsLoaded}
          >
            {inflight ? <span className="size-3 rounded-xs bg-primary" /> : <ArrowUp className="size-5 stroke-1" />}
          </Button>
        </div>
      </SectionInner>
    </Section>
  )
}
