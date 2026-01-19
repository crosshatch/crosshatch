import { chatItems, chats } from "@/schema"
import Worker from "@/worker.ts?worker"
import { liveQuery } from "@crosshatch/drizzle/pglite/index"
import { PgliteClient } from "@crosshatch/effect-pglite"
import { BridgeClient } from "@crosshatch/react"
import { LoggerLive } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom-react"
import { OpenRouterClient } from "@effect/ai-openrouter"
import { FetchHttpClient } from "@effect/platform"
import { BrowserKeyValueStore } from "@effect/platform-browser"
import { fetch } from "crosshatch"
import { desc, eq, sql } from "drizzle-orm"
import { Config, ConfigProvider, Effect, Layer, Schema as S } from "effect"
import { Drizzle } from "./Drizzle"
import type { ChatId } from "./ids"

export const runtime = Atom.runtime(
  Layer.mergeAll(
    LoggerLive,
    BridgeClient.layer,
    Drizzle.Default.pipe(
      Layer.provideMerge(PgliteClient.layerWorker(Worker)),
    ),
    OpenRouterClient.layerConfig({
      apiKey: Config.redacted("VITE_PUBLIC_OPEN_ROUTER_API_KEY"),
      referrer: Config.succeed("chat.crosshatch.dev"),
    }).pipe(
      Layer.provide(
        FetchHttpClient.layer.pipe(
          Layer.provide(
            Layer.succeed(FetchHttpClient.Fetch, fetch),
          ),
        ),
      ),
    ),
  ).pipe(
    Layer.provideMerge(
      Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env)),
    ),
  ),
)

export const q = liveQuery(Drizzle)

export const chatsAtom = runtime.atom(
  q((_) => _.select().from(chats).orderBy(desc(chats.updated))),
).pipe(
  Atom.keepAlive,
)

export const deleteChatAtom = runtime.fn<typeof ChatId.Type>()(Effect.fn(function*(chatId) {
  const _ = yield* Drizzle
  return yield* _.delete(chats).where(eq(chats.id, chatId))
}))

export const renameChatAtom = runtime.fn<{
  id: typeof ChatId.Type
  title: string
}>()(Effect.fn(function*({ id, title }) {
  const _ = yield* Drizzle
  return yield* _.update(chats).set({ title }).where(eq(chats.id, id))
}))

export const chatItemsAtom = Atom.family((chatId?: typeof ChatId.Type | undefined) =>
  runtime.atom(
    q((_) =>
      _.select().from(chatItems).where(
        chatId ? eq(chatItems.chatId, chatId) : sql`1 = 0`,
      )
    ),
  ).pipe(
    Atom.keepAlive,
  )
)

export const modelIdsAtom = runtime.atom(
  Effect.gen(function*() {
    const { client } = yield* OpenRouterClient.OpenRouterClient
    const { data } = yield* client.getModels()
    return data.map(({ id }) => id)
  }),
)

const currentModelIdState = Atom.kvs({
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  key: "current-model",
  schema: S.String.pipe(S.NullOr),
  defaultValue: () => null,
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
