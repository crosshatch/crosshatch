import { chatAtom } from "@/atoms"
import { ModelSelect } from "@/components/ModelSelect"
import { Button } from "@crosshatch/ui/components/Button"
import { Section, SectionInner } from "@crosshatch/ui/components/Section"
import { Textarea } from "@crosshatch/ui/components/Textarea"
import { useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { openSessionWidgetAtom } from "crosshatch"
import { ArrowUp } from "lucide-react"
import { HandCoins } from "lucide-react"
import { useEffect, useRef } from "react"

export const ChatControls = ({
  chatId,
  text,
  onTextChange,
  submit,
  additionalDisabled,
}: {
  chatId: string | undefined
  text: string
  onTextChange: (text: string) => void
  submit: () => void
  additionalDisabled?: boolean | undefined
}) => {
  const sessionButtonOnClick = useAtomSet(openSessionWidgetAtom)
  const ref = useRef<HTMLTextAreaElement>(null)
  const { inflight } = useAtomValue(chatAtom(chatId))
  useEffect(() => ref?.current?.focus(), [chatId])
  return (
    <Section className="p-4 sticky border-t bottom-0 right-0 left-0 bg-background/90 backdrop-blur-lg">
      <SectionInner className="space-y-2">
        <Textarea
          ref={ref}
          value={text}
          onChange={({ target: { value } }) => onTextChange(value)}
          placeholder="Your message..."
          className="text-primary p-4 min-h-30 rounded-2xl w-full resize-none border shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === "Enter") {
              e.preventDefault()
              submit()
            }
          }}
        />
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="flex flex-row">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                className="rounded-full"
                variant="outline"
                onClick={() => sessionButtonOnClick()}
              >
                <HandCoins />
              </Button>
              <ModelSelect />
            </div>
          </div>
          <Button
            onClick={() => inflight ? inflight.abort() : submit()}
            size="icon"
            className="size-9 rounded-full cursor-pointer"
            variant="outline"
            disabled={!(text || inflight) || additionalDisabled}
          >
            {inflight ? <span className="size-3 rounded-xs bg-primary" /> : <ArrowUp size={18} />}
          </Button>
        </div>
      </SectionInner>
    </Section>
  )
}
