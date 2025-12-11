import { cn } from "@crosshatch/ui/cn"
import { Button } from "@crosshatch/ui/components/button"
import { useLocation } from "@tanstack/react-router"
import { cva } from "class-variance-authority"
import { Collapsible, CollapsibleContent } from "fumadocs-ui/components/ui/collapsible"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { type SyntheticEvent, useEffect, useState, useTransition } from "react"

const rateButtonVariants = cva(
  "inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current",
        false: "text-fd-muted-foreground",
      },
    },
  },
)

export interface Feedback {
  opinion: "good" | "bad"
  url?: string
  message: string
}

export function Feedback({
  onRateAction,
}: {
  onRateAction: (url: string, feedback: Feedback) => Promise<void>
}) {
  const { url } = useLocation()
  const [previous, setPrevious] = useState<Feedback | null>(null)
  const [opinion, setOpinion_] = useState<"good" | "bad" | null>(null)
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  const setOpinion = (opinion_: "good" | "bad" | null) => {
    if (opinion_ === opinion) setOpinion_(null)
    else setOpinion_(opinion_)
  }

  useEffect(() => {
    const item = localStorage.getItem(`docs-feedback-${url}`)

    if (item === null) return
    setPrevious(JSON.parse(item) as Feedback)
  }, [url])

  useEffect(() => {
    const key = `docs-feedback-${url}`

    if (previous) localStorage.setItem(key, JSON.stringify(previous))
    else localStorage.removeItem(key)
  }, [previous, url])

  function submit(e?: SyntheticEvent) {
    if (opinion == null) return

    startTransition(async () => {
      const feedback: Feedback = {
        opinion,
        message,
      }

      void onRateAction(url, feedback).then(() => {
        setPrevious({ ...feedback })
        setMessage("")
        setOpinion(null)
      })
    })

    e?.preventDefault()
  }

  const activeOpinion = previous?.opinion ?? opinion

  return (
    <Collapsible
      open={opinion !== null || previous !== null}
      onOpenChange={(v) => {
        if (!v) setOpinion(null)
      }}
      className="border-y py-3"
    >
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === "good",
            }),
          )}
          onClick={() => {
            setOpinion("good")
          }}
        >
          <ThumbsUp />
          Good
        </button>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === "bad",
            }),
          )}
          onClick={() => {
            setOpinion("bad")
          }}
        >
          <ThumbsDown />
          Bad
        </button>
      </div>
      <CollapsibleContent className="mt-3">
        {previous
          ? (
            <div className="px-3 py-6 flex flex-col items-center gap-3 bg-fd-card text-center rounded-xl">
              <p>Thank you for your feedback!</p>
              <div className="flex flex-row items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpinion(previous.opinion)
                    setPrevious(null)
                  }}
                >
                  Submit Again
                </Button>
              </div>
            </div>
          )
          : (
            <form className="flex flex-col gap-3" onSubmit={submit}>
              <textarea
                autoFocus
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border rounded-lg bg-fd-secondary text-fd-secondary-foreground p-3 resize-none focus-visible:outline-none placeholder:text-fd-muted-foreground"
                placeholder="Your feedback..."
                onKeyDown={(e) => {
                  if (!e.shiftKey && e.key === "Enter") {
                    submit(e)
                  }
                }}
              />
              <div className="flex flex-1">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isPending}
                  className="flex flex-1"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
      </CollapsibleContent>
    </Collapsible>
  )
}
