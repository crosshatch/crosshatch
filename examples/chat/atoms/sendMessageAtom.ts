import { currentModelIdAtom } from "@/atoms/ai_atoms"
import { chatAtom, chatItemsAtom } from "@/atoms/chat_atoms"
import { runtime } from "@/atoms/runtime"
import { Drizzle } from "@/Drizzle"
import { ChatId } from "@/ids"
import { router } from "@/router"
import { chatItems, chats, embeddings } from "@/schema"
import { FirecrawlToolkit } from "@/tools/FirecrawlToolkit"
import { tx } from "@/tx"
import * as AtomUtil from "@crosshatch/ui/AtomUtil"
import { e0, nonNullable } from "@crosshatch/util/unwrapping"
import { AiError, EmbeddingModel, LanguageModel, Prompt } from "@effect/ai"
import { OpenAiLanguageModel } from "@effect/ai-openai"
import { isLinkedAtom, openSessionWidgetAtom } from "crosshatch"
import { eq } from "drizzle-orm"
import { Cause, Effect, Fiber } from "effect"

export const sendMessageAtom = runtime.fn<typeof ChatId.Type | undefined>()(Effect.fn(function*(chatId, get) {
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
        to: "/{-$chatId}",
        params: { chatId },
      })
    )
    yield* Effect.tryPromise(() => _.insert(chats).values({ id }))
    titleFiber = yield* Effect.gen(function*() {
      const { text: title } = yield* LanguageModel.generateText({
        prompt: `
          I'm about to provide you with a message. Create a concise title for the message.
          Don't place the title inside of quotes. Provide just a few words in title case.
          ---
          ${text}
        `,
      }).pipe(Effect.provide(OpenAiLanguageModel.layer({
        model: "gpt-3.5-turbo",
      })))
      yield* Effect.tryPromise(() => _.update(chats).set({ title }).where(eq(chats.id, id)))
    }).pipe(
      Effect.fork,
    )
  }
  const userMessage = Prompt.userMessage({
    content: [Prompt.makePart("text", { text })],
  })
  const em = yield* EmbeddingModel.EmbeddingModel
  const userMessageEmbedding = yield* em.embed(text)
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
      ).pipe(e0, nonNullable),
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
  let prompt = Prompt.make([...items.map(({ message }) => message), userMessage])
  let generated = yield* LanguageModel.generateText({
    prompt,
    toolkit: FirecrawlToolkit,
  })
  // TODO: save tool calls in database
  while (generated.toolCalls.length > 0) {
    prompt = Prompt.merge(prompt, Prompt.fromResponseParts(generated.content))
    generated = yield* LanguageModel.generateText({
      prompt,
      toolkit: FirecrawlToolkit,
    })
  }
  const { text: incoming } = generated
  const assistantMessageEmbedding = yield* em.embed(incoming)
  yield* tx(Effect.fn(function*(_) {
    const [{ id: chatItemId }] = yield* Effect.all([
      Effect.tryPromise(() =>
        _
          .insert(chatItems)
          .values({
            chatId,
            message: Prompt.assistantMessage({
              content: [Prompt.makePart("text", { text: incoming })],
            }),
          })
          .returning()
      ).pipe(e0, nonNullable),
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
}, (x, _1, get) =>
  Effect.provide(
    x,
    OpenAiLanguageModel.layer({
      model: get(currentModelIdAtom),
    }),
  )))
