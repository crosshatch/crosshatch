import { Atom } from "@effect-atom/atom-react"
import { OpenAiClient, OpenAiEmbeddingModel } from "@effect/ai-openai"
import { CrosshatchHttpClient } from "crosshatch"
import { Effect, Layer, Redacted } from "effect"

import { CrosshatchChatEnv } from "@/CrosshatchChatEnv"
// import { FirecrawlToolkitLive } from "@/tools/FirecrawlToolkitLive"

import { Drizzle, PgliteClient } from "../Drizzle"

const OpenAiClientLive = CrosshatchChatEnv.pipe(
  Effect.map(({ shapes: apiUrl }) =>
    OpenAiClient.layer({
      apiKey: Redacted.make(""),
      apiUrl,
    }),
  ),
  Layer.unwrapEffect,
)

export const runtime = Atom.runtime(
  Layer.mergeAll(
    Drizzle.Default.pipe(Layer.provideMerge(PgliteClient.Default)),
    OpenAiEmbeddingModel.model("text-embedding-ada-002", {
      mode: "batched",
    }).pipe(Layer.provideMerge(OpenAiClientLive)),
    // FirecrawlToolkitLive,
  ).pipe(Layer.provide([CrosshatchHttpClient, CrosshatchChatEnv.layer])),
)
