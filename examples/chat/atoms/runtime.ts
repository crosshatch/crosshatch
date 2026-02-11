import Worker from "@/worker.ts?worker"
import { PgliteClient } from "@crosshatch/store"
import { LoggerLive } from "@crosshatch/util/LoggerLive"
import { Atom } from "@effect-atom/atom-react"
import { OpenAiClient, OpenAiEmbeddingModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Live, makeFetch } from "crosshatch"
import { ConfigProvider, Layer, Redacted } from "effect"
import { Drizzle } from "../Drizzle"

export const runtime = Atom.runtime(
  Layer.mergeAll(
    Live,
    Drizzle.Default.pipe(
      Layer.provideMerge(PgliteClient.layer(Worker)),
    ),
    OpenAiEmbeddingModel.model("text-embedding-ada-002", {
      mode: "batched",
    }).pipe(
      Layer.provideMerge(OpenAiClient.layer({
        apiKey: Redacted.make(""),
        apiUrl: "http://localhost:7775",
      })),
    ),
  ).pipe(
    Layer.provide(
      FetchHttpClient.layer.pipe(
        Layer.provide(
          Layer.succeed(FetchHttpClient.Fetch, makeFetch(fetch)),
        ),
      ),
    ),
    Layer.provide(LoggerLive),
    Layer.provide(
      Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env)),
    ),
  ),
)
