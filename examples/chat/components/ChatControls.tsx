import * as AtomUtil from "@crosshatch/ui/AtomUtil"
import { Button } from "@crosshatch/ui/components/Button"
import { Section, SectionInner } from "@crosshatch/ui/components/Section"
import { Sus } from "@crosshatch/ui/components/Sus"
import { Textarea } from "@crosshatch/ui/components/Textarea"
import { e0, nonNullable } from "@crosshatch/util/unwrapping"
import { useAtom, useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { AiError, EmbeddingModel, LanguageModel, Prompt } from "@effect/ai"
import { OpenAiLanguageModel } from "@effect/ai-openai"
import { isLinkedAtom, openSessionWidgetAtom } from "crosshatch"
import { eq } from "drizzle-orm"
import { Cause, Effect, Fiber } from "effect"
import { ArrowUp } from "lucide-react"
import { useEffect, useRef } from "react"

import { currentModelIdAtom } from "@/atoms"
import { modelIdsAtom, chatAtom, chatItemsAtom } from "@/atoms"
import { ModelSelect } from "@/components/ModelSelect"
import { Drizzle } from "@/Drizzle"
import { ChatId } from "@/ids"
import { router } from "@/router"
import { Route } from "@/routes/{-$chatId}"
import { runtime } from "@/runtime"
import { chatItems, chats, embeddings } from "@/schema"
import { tx } from "@/tx"

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

export const sendMessageAtom = runtime.fn<typeof ChatId.Type | undefined>()(
  Effect.fn(
    function* (chatId, get) {
      const isLinked = yield* get.result(isLinkedAtom)
      if (!isLinked) {
        yield* get.setResult(openSessionWidgetAtom, void 0)
      }
      let { text } = get(chatAtom(chatId))
      const items = yield* get.result(chatItemsAtom(chatId))
      text = text.trim()
      if (!text) return
      const _ = yield* Drizzle
      let titleFiber: Fiber.RuntimeFiber<void, Cause.UnknownException | AiError.AiError> | undefined
      if (!chatId) {
        const id = ChatId.make(crypto.randomUUID())
        chatId = id
        AtomUtil.assign(get)(chatAtom(undefined), { text: "" })
        yield* Effect.tryPromise(() =>
          router.navigate({
            params: { chatId },
            to: "/{-$chatId}",
          }),
        )
        yield* Effect.tryPromise(() => _.insert(chats).values({ id }))
        titleFiber = yield* Effect.gen(function* () {
          const { text: title } = yield* LanguageModel.generateText({
            prompt: `
          I'm about to provide you with a message. Create a concise title for the message.
          Don't place the title inside of quotes. Provide just a few words in title case.
          ---
          ${text}
        `,
          }).pipe(
            Effect.provide(
              OpenAiLanguageModel.layer({
                model: "gpt-3.5-turbo",
              }),
            ),
          )
          yield* Effect.tryPromise(() => _.update(chats).set({ title }).where(eq(chats.id, id)))
        }).pipe(Effect.fork)
      }
      const userMessage = Prompt.userMessage({
        content: [Prompt.makePart("text", { text })],
      })
      const em = yield* EmbeddingModel.EmbeddingModel
      const userMessageEmbedding = yield* em.embed(text)
      yield* tx(
        Effect.fn(function* (_) {
          const { id: chatItemId } = yield* Effect.promise(() =>
            _.insert(chatItems)
              .values({
                chatId,
                message: userMessage,
              })
              .returning(),
          ).pipe(
            e0,
            nonNullable,
            Effect.zipLeft(
              Effect.promise(() => _.update(chats).set({ updated: new Date() }).where(eq(chats.id, chatId))),
              { concurrent: true },
            ),
          )
          yield* Effect.promise(() =>
            _.insert(embeddings).values({
              chatItemId,
              embedding: userMessageEmbedding,
            }),
          )
        }),
      )
      const inflight = new AbortController()
      AtomUtil.assign(get)(chatAtom(chatId), {
        inflight,
        text: "",
      })
      let prompt = Prompt.make([...items.map(({ message }) => message), userMessage])
      let generated = yield* LanguageModel.generateText({
        prompt,
        // toolkit: FirecrawlToolkit,
      })
      // TODO: save tool calls in database
      while (generated.toolCalls.length > 0) {
        prompt = Prompt.merge(prompt, Prompt.fromResponseParts(generated.content))
        generated = yield* LanguageModel.generateText({
          prompt,
          // toolkit: FirecrawlToolkit,
        })
      }
      const { text: incoming } = generated
      const assistantMessageEmbedding = yield* em.embed(incoming)
      yield* tx(
        Effect.fn(function* (_) {
          const [{ id: chatItemId }] = yield* Effect.all(
            [
              Effect.tryPromise(() =>
                _.insert(chatItems)
                  .values({
                    chatId,
                    message: Prompt.assistantMessage({
                      content: [Prompt.makePart("text", { text: incoming })],
                    }),
                  })
                  .returning(),
              ).pipe(e0, nonNullable),
              Effect.tryPromise(() => _.update(chats).set({ updated: new Date() }).where(eq(chats.id, chatId))),
            ],
            { concurrency: "unbounded" },
          )
          yield* Effect.tryPromise(() =>
            _.insert(embeddings).values({
              chatItemId,
              embedding: assistantMessageEmbedding,
            }),
          )
        }),
      )
      AtomUtil.assign(get)(chatAtom(chatId), {
        inflight: undefined,
      })
      if (titleFiber) yield* Fiber.join(titleFiber)
      inflight.abort()
    },
    (x, _1, get) =>
      Effect.provide(
        x,
        OpenAiLanguageModel.layer({
          model: get(currentModelIdAtom),
        }),
      ),
  ),
)
