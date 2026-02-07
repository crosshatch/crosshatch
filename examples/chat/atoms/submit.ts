import { chatAtom, chatItemsAtom, currentModelIdAtom, runtime } from "@/atoms"
import { Drizzle } from "@/Drizzle"
import { ChatId } from "@/ids"
import { embed, openai } from "@/lib/openai"
import { router } from "@/router"
import { chatItems, chats, embeddings } from "@/schema"
import { tx } from "@/tx"
import { txNonNullable } from "@crosshatch/drizzle"
import * as AtomUtil from "@crosshatch/ui/AtomUtil"
import { e0 } from "@crosshatch/util/unwrapping"
import { generateText, type UserModelMessage } from "ai"
import { isLinkedAtom, openSessionWidgetAtom } from "crosshatch"
import { eq } from "drizzle-orm"
import { Cause, Effect, Fiber } from "effect"

export const submitAtom = runtime.fn<typeof ChatId.Type | undefined>()(Effect.fn(function*(chatId, get) {
  const isLinked = yield* get.result(isLinkedAtom)
  if (!isLinked) {
    yield* get.setResult(openSessionWidgetAtom, void 0)
  }
  let { text } = get(chatAtom(chatId))
  const items = yield* get.result(chatItemsAtom(chatId))
  text = text.trim()
  if (!text) return
  const _ = yield* Drizzle
  const modelId = yield* get.result(currentModelIdAtom)
  let titleFiber: Fiber.RuntimeFiber<void, Cause.UnknownException> | undefined
  if (!chatId) {
    const id = ChatId.make(crypto.randomUUID())
    chatId = id
    AtomUtil.assign(get)(chatAtom(undefined), { text: "" })
    yield* Effect.tryPromise(() =>
      router.navigate({
        to: "/{-$chatId}",
        params: { chatId },
      })
    )
    yield* Effect.tryPromise(() => _.insert(chats).values({ id }))
    titleFiber = yield* Effect.gen(function*() {
      const { text: title } = yield* Effect.tryPromise(() =>
        generateText({
          maxRetries: 0,
          model: openai("gpt-3.5-turbo"),
          messages: [{
            role: "user",
            content: `
              I'm about to provide you with a message. Create a concise title for the message.
              Don't place the title inside of quotes. Provide just a few words in title case.
              ---
              ${text}
            `,
          }],
        })
      )
      yield* Effect.tryPromise(() => _.update(chats).set({ title }).where(eq(chats.id, id)))
    }).pipe(
      Effect.fork,
    )
  }
  const userMessage: UserModelMessage = {
    role: "user",
    content: text,
  }
  const userMessageEmbedding = yield* embed(text)
  yield* tx(Effect.fn(function*(_) {
    const [{ id: chatItemId }] = yield* Effect.all([
      Effect.promise(() =>
        _
          .insert(chatItems)
          .values({
            chatId,
            message: userMessage,
          })
          .returning()
      ).pipe(e0, txNonNullable),
      Effect.promise(
        () => _.update(chats).set({ updated: new Date() }).where(eq(chats.id, chatId)),
      ),
    ], { concurrency: "unbounded" })
    yield* Effect.promise(() =>
      _.insert(embeddings).values({
        chatItemId,
        embedding: userMessageEmbedding,
      })
    )
  }))
  const inflight = new AbortController()
  AtomUtil.assign(get)(chatAtom(chatId), {
    inflight,
    text: "",
  })
  const { text: incoming, response: { messages } } = yield* Effect.tryPromise(() =>
    generateText({
      model: openai(modelId),
      messages: [...items.map((v) => v.message), userMessage],
      maxRetries: 0,
    })
  )
  const assistantMessageEmbedding = yield* embed(incoming)
  yield* tx(Effect.fn(function*(_) {
    const [{ id: chatItemId }] = yield* Effect.all([
      Effect.tryPromise(() =>
        _
          .insert(chatItems)
          .values(messages.map((message) => ({ chatId, message })))
          .returning()
      ).pipe(e0, txNonNullable),
      Effect.tryPromise(() =>
        _
          .update(chats)
          .set({ updated: new Date() }).where(eq(chats.id, chatId))
      ),
    ], { concurrency: "unbounded" })
    yield* Effect.tryPromise(() =>
      _.insert(embeddings).values({
        chatItemId,
        embedding: assistantMessageEmbedding,
      })
    )
  }))
  AtomUtil.assign(get)(chatAtom(chatId), {
    inflight: undefined,
  })
  if (titleFiber) yield* Fiber.join(titleFiber)
  inflight.abort()
}))
