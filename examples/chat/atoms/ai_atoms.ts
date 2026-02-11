import { runtime } from "@/atoms/runtime"
import { Atom } from "@effect-atom/atom-react"
import { BrowserKeyValueStore } from "@effect/platform-browser"
import { Effect, Schema as S } from "effect"
import {} from "@effect/ai"
import { OpenAiClient } from "@effect/ai-openai"

export const modelIdsAtom = runtime.atom(
  OpenAiClient.OpenAiClient.pipe(
    Effect.flatMap((v) => v.client.listModels()),
    Effect.map(({ data }) => data.map((v) => v.id)),
  ),
)

export const currentModelIdAtom = Atom.kvs({
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  key: "current-model",
  schema: S.String,
  defaultValue: () => "gpt-3.5-turbo",
}).pipe(
  Atom.keepAlive,
)
