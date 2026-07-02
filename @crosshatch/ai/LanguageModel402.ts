import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { Effect, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { LanguageModelAdapter } from "./Adapter.ts"

/**
 * Composes an effect `LanguageModel` from a provider adapter.
 *
 * Payment is not bundled: provide a paying fetch from the outside, e.g.
 * `layer.pipe(Layer.provide(Headless.layerConfig(mnemonicConfig, KnownAsset)))`.
 * Without one, requests go out unpaid and fail at runtime with a 402.
 */
export const make = <EAdapter, RAdapter>(config: {
  readonly model: string
  readonly adapter: Layer.Layer<LanguageModelAdapter, EAdapter, RAdapter>
}) =>
  OpenAiLanguageModel.layer({ model: config.model }).pipe(
    Layer.provide(
      Layer.effect(
        OpenAiClient.OpenAiClient,
        Effect.gen(function* () {
          const base = yield* OpenAiClient.make({})
          const adapter = yield* LanguageModelAdapter
          return {
            ...base,
            createResponse: adapter.createResponse,
          }
        }),
      ),
    ),
    Layer.provide(config.adapter),
    Layer.provide(FetchHttpClient.layer),
  )
