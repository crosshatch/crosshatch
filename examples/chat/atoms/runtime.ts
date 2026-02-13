import { FirecrawlToolkitLive } from "@/tools/FirecrawlToolkitLive"
import Worker from "@/worker.ts?worker"
import { PgliteClient } from "@crosshatch/store"
import { Atom } from "@effect-atom/atom-react"
import { OpenAiClient, OpenAiEmbeddingModel } from "@effect/ai-openai"
import { CrosshatchHttpClient } from "crosshatch"
import { Layer, Redacted } from "effect"
import { Drizzle } from "../Drizzle"

export const runtime = Atom.runtime(
  Layer.mergeAll(
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
    FirecrawlToolkitLive,
  ).pipe(
    Layer.provide(CrosshatchHttpClient),
  ),
)
