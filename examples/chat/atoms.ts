import { EnclaveClient } from "@crosshatch/react"
import { LoggerLive } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom-react"
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { fetch } from "crosshatch"
import { Config, ConfigProvider, Layer } from "effect"

export const model = OpenAiLanguageModel.layer({ model: "..." }).pipe(
  Layer.provide(
    OpenAiClient.layerConfig({
      apiUrl: Config.succeed("..."),
    }).pipe(
      Layer.provide(
        FetchHttpClient.layer.pipe(
          Layer.provide(
            Layer.succeed(FetchHttpClient.Fetch, fetch),
          ),
        ),
      ),
    ),
  ),
)

export const runtime = Atom.runtime(
  Layer.mergeAll(
    LoggerLive,
    EnclaveClient.layer,
    model,
  ).pipe(
    Layer.provideMerge(
      Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env)),
    ),
  ),
)
