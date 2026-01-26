import { chats } from "@/schema"
import Worker from "@/worker.ts?worker"
import { BridgeClient } from "@crosshatch/react"
import { PgliteClient } from "@crosshatch/store"
import { access, LoggerLive } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom-react"
import { OpenRouterClient } from "@effect/ai-openrouter"
import { BrowserKeyValueStore } from "@effect/platform-browser"
import { FetchHttpClientLive } from "crosshatch/effect"
import { desc, eq, sql } from "drizzle-orm"
import { Array, Config, ConfigProvider, Effect, Layer, Option, Schema as S } from "effect"
import { Drizzle, latest } from "./Drizzle"
import type { ChatId } from "./ids"

export const runtime = Atom.runtime(
  Layer.mergeAll(
    LoggerLive,
    BridgeClient.layer,
    Drizzle.Default.pipe(
      Layer.provideMerge(PgliteClient.layer(Worker)),
    ),
    OpenRouterClient.layerConfig({
      apiKey: Config.redacted("VITE_PUBLIC_OPEN_ROUTER_API_KEY"),
      referrer: Config.succeed("chat.crosshatch.dev"),
    }),
  ).pipe(
    Layer.provide(FetchHttpClientLive),
    Layer.provide(
      Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env)),
    ),
  ),
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
        where: chatId
          ? { chatId: { eq: chatId } }
          : { RAW: sql`1 = 0` },
      })
    ),
  ).pipe(
    Atom.keepAlive,
  )
)

const ListModelsSuccess = S.Struct({
  data: S.Array(S.Struct({
    id: S.String,
    name: S.String,
    supported_parameters: S.Array(S.String),
    architecture: S.Struct({
      input_modalities: S.Array(S.String),
      output_modalities: S.Array(S.String),
    }),
  })),
})

export const modelIdsAtom = runtime.atom(
  Effect.tryPromise(
    () => fetch("https://openrouter.ai/api/v1/models").then((v) => v.json()),
  ).pipe(
    Effect.flatMap(S.decodeUnknown(ListModelsSuccess)),
    access("data"),
    Effect.map(
      Array.filterMap((v) =>
        v.supported_parameters.includes("tools") && v.supported_parameters.includes("tool_choice")
          && !v.supported_parameters.includes("reasoning")
          ? Option.some(v.id)
          : Option.none()
      ),
    ),
  ),
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
