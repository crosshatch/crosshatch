import { OpenAiClient } from "@effect/ai-openai"
import { BrowserKeyValueStore } from "@effect/platform-browser"
import { desc, eq, sql } from "drizzle-orm"
import { Effect, Schema as S } from "effect"
import { Atom } from "effect/unstable/reactivity"

import { Drizzle, latest } from "@/Drizzle"
import { runtime } from "@/runtime"
import { chats } from "@/schema"

export const modelIdsAtom = runtime.atom(
  OpenAiClient.OpenAiClient.asEffect().pipe(
    Effect.flatMap((v) => v.client.listModels({})),
    Effect.map(({ data }) => data.map((v) => v.id)),
  ),
)

export const currentModelIdAtom = Atom.kvs({
  defaultValue: () => "gpt-3.5-turbo",
  key: "current-model",
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  schema: S.String,
}).pipe(Atom.keepAlive)

export const chatAtom = Atom.family((_chatId?: string | undefined) =>
  Atom.make({
    inflight: undefined,
    text: "",
  } as {
    text: string
    inflight: AbortController | undefined
  }).pipe(Atom.keepAlive),
)

export const chatsAtom = runtime
  .atom(latest((_) => _.select().from(chats).orderBy(desc(chats.updated))))
  .pipe(Atom.keepAlive)

export const deleteChatAtom = runtime.fn<string>()(
  Effect.fn(function* (chatId) {
    const _ = yield* Drizzle
    return yield* Effect.tryPromise(() => _.delete(chats).where(eq(chats.id, chatId)))
  }),
)

export const renameChatAtom = runtime.fn<{
  id: string
  title: string
}>()(
  Effect.fn(function* ({ id, title }) {
    const _ = yield* Drizzle
    return yield* Effect.tryPromise(() => _.update(chats).set({ title }).where(eq(chats.id, id)))
  }),
)

export const chatItemsAtom = Atom.family((chatId?: string | undefined) =>
  runtime
    .atom(
      latest((_) =>
        _.query.chatItems.findMany({
          where: chatId ? { chatId: { eq: chatId } } : { RAW: sql`1 = 0` },
        }),
      ),
    )
    .pipe(Atom.keepAlive),
)
