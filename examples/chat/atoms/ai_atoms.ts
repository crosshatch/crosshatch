import { Atom } from "@effect-atom/atom-react"
import {} from "@effect/ai"
import { OpenAiClient } from "@effect/ai-openai"
import { BrowserKeyValueStore } from "@effect/platform-browser"
import { Effect, Schema as S } from "effect"

import { runtime } from "@/atoms/runtime"

export const modelIdsAtom = runtime.atom(
  OpenAiClient.OpenAiClient.pipe(
    Effect.flatMap((v) => v.client.listModels()),
    Effect.map(({ data }) => data.map((v) => v.id)),
  ),
)

export const currentModelIdAtom = Atom.kvs({
  defaultValue: () => "gpt-3.5-turbo",
  key: "current-model",
  runtime: Atom.runtime(BrowserKeyValueStore.layerLocalStorage),
  schema: S.String,
}).pipe(Atom.keepAlive)
