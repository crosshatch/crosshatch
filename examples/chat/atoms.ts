import { chatItems, chats } from "@/schema"
import { Store } from "@/Store"
import StoreWorker from "@/StoreWorker.ts?worker"
import { EnclaveClient } from "@crosshatch/react"
import { LoggerLive } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom-react"
import { OpenRouterClient } from "@effect/ai-openrouter"
import { FetchHttpClient } from "@effect/platform"
import { BrowserKeyValueStore } from "@effect/platform-browser"
import { desc, eq, sql } from "drizzle-orm"
import { Config, ConfigProvider, Effect, Layer, Schema as S } from "effect"

// TODO: use Crosshatch fetch
const fetch_: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers)
  headers.delete("traceparent")
  headers.delete("tracestate")
  headers.delete("b3")
  headers.delete("x-b3-traceid")
  headers.delete("x-b3-spanid")
  headers.delete("x-b3-sampled")
  headers.delete("http-referrer")
  return fetch(input, { ...init, headers })
}

export const runtime = Atom.runtime(
  Layer.mergeAll(
    LoggerLive,
    EnclaveClient.layer,
    Store.layer(StoreWorker),
    OpenRouterClient.layerConfig({
      apiKey: Config.redacted("VITE_PUBLIC_OPEN_ROUTER_API_KEY"),
      referrer: Config.succeed("chat.crosshatch.dev"),
    }).pipe(
      Layer.provide(
        FetchHttpClient.layer.pipe(
          Layer.provide(
            Layer.succeed(FetchHttpClient.Fetch, fetch_),
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

export const chatsAtom = runtime.atom(
  Store.latest((_) => _.select().from(chats).orderBy(desc(chats.updated))),
).pipe(
  Atom.keepAlive,
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

export const deleteChatAtom = runtime.fn(
  (id: string) => Store.f((_) => _.delete(chats).where(eq(chats.id, id))),
)

export const renameChatAtom = runtime.fn(({ id, title }: {
  id: string
  title: string
}) => Store.f((_) => _.update(chats).set({ title }).where(eq(chats.id, id))))

export const chatItemsAtom = Atom.family((chatId?: string | undefined) =>
  runtime.atom(
    Store.latest((_) =>
      _.select().from(chatItems).where(
        chatId ? eq(chatItems.chatId, chatId) : sql`1 = 0`,
      )
    ),
  ).pipe(
    Atom.keepAlive,
  )
)

export const currentModelIdAtom = Atom.kvs({
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  key: "current-model",
  schema: S.String,
  defaultValue: () => "gpt-3.5-turbo",
}).pipe(
  Atom.keepAlive,
)

export const modelIdsAtom = runtime.atom(
  Effect.gen(function*() {
    const { client } = yield* OpenRouterClient.OpenRouterClient
    const { data } = yield* client.getModels()
    return data.map(({ id }) => id)
  }),
)
