import { chats } from "@/schema"
import Worker from "@/worker.ts?worker"
import { BridgeClient } from "@crosshatch/react"
import { PgliteClient } from "@crosshatch/store"
import { LoggerLive } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom-react"
import { BrowserKeyValueStore } from "@effect/platform-browser"
import { FetchHttpClientLive } from "crosshatch/effect"
import { desc, eq, sql } from "drizzle-orm"
import { ConfigProvider, Effect, Layer, Schema as S } from "effect"
import { Drizzle, latest } from "./Drizzle"
import type { ChatId } from "./ids"

export const runtime = Atom.runtime(
  Layer.mergeAll(
    LoggerLive,
    BridgeClient.layer,
    Drizzle.Default.pipe(
      Layer.provideMerge(PgliteClient.layer(Worker)),
    ),
  ).pipe(
    Layer.provide(FetchHttpClientLive),
    Layer.provide(
      Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env)),
    ),
  ),
)

export const chatAtom = Atom.family((_chatId?: string | undefined) =>
  Atom.make({
    text: "",
    inflight: undefined,
  } as {
    text: string
    inflight: AbortController | undefined
  }).pipe(
    Atom.keepAlive,
  )
)

export const chatsAtom = runtime.atom(
  latest((_) => _.select().from(chats).orderBy(desc(chats.updated))),
).pipe(
  Atom.keepAlive,
)

export const deleteChatAtom = runtime.fn<typeof ChatId.Type>()(Effect.fn(function*(chatId) {
  const _ = yield* Drizzle
  return yield* Effect.tryPromise(() => _.delete(chats).where(eq(chats.id, chatId)))
}))

export const renameChatAtom = runtime.fn<{
  id: typeof ChatId.Type
  title: string
}>()(Effect.fn(function*({ id, title }) {
  const _ = yield* Drizzle
  return yield* Effect.tryPromise(() => _.update(chats).set({ title }).where(eq(chats.id, id)))
}))

export const chatItemsAtom = Atom.family((chatId?: typeof ChatId.Type | undefined) =>
  runtime.atom(
    latest((_) =>
      _.query.chatItems.findMany({
        where: chatId ? { chatId: { eq: chatId } } : { RAW: sql`1 = 0` },
      })
    ),
  ).pipe(
    Atom.keepAlive,
  )
)

export const modelIdsAtom = runtime.atom(
  Effect.tryPromise(
    () => fetch("http://localhost:7775/models").then((v) => v.json()),
  ).pipe(
    Effect.flatMap(S.decodeUnknown(S.Struct({
      data: S.Array(S.Struct({
        id: S.String,
      })),
    }))),
    Effect.map((v) => v.data.map(({ id }) => id)),
  ),
)

const currentModelIdState = Atom.kvs({
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  key: "current-model",
  schema: S.String.pipe(S.NullOr),
  defaultValue: () => "gpt-3.5-turbo",
}).pipe(
  Atom.keepAlive,
)
export const currentModelIdAtom = Atom.writable(
  runtime.atom(Effect.fn(function*(get) {
    const models = yield* get.result(modelIdsAtom)
    const currentModel = get(currentModelIdState)
    return currentModel ?? (yield* Effect.fromNullable(models[0]))
  })).read,
  (get, modelId: string) => {
    get.set(currentModelIdState, modelId)
  },
)
