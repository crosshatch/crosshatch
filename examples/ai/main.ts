import { BlockRun } from "@crosshatch/ai"
import { NodeStdio } from "@effect/platform-node"
import { Mnemonic } from "crosshatch"
import * as Headless from "crosshatch/Headless"
import * as KnownAsset from "crosshatch/KnownAsset"
import { Console, Effect, Schema as S, Stdio, Stream } from "effect"
import { Chat, Model, type Response, Tool, Toolkit } from "effect/unstable/ai"

const WeatherToolkit = Toolkit.make(
  Tool.make("get_weather", {
    description: "Get the current weather for a city",
    parameters: S.Struct({ city: S.String }),
    success: S.Struct({ summary: S.String }),
  }),
)

const WeatherHandlers = WeatherToolkit.toLayer({
  get_weather: ({ city }) => Effect.succeed({ summary: `It is 21°C and sunny in ${city}.` }),
})

const Forecast = S.Struct({
  city: S.String,
  temperature: S.Number,
  conditions: S.String,
})

const printText = <E, R>(parts: Stream.Stream<Response.StreamPart<any>, E, R>) =>
  Effect.gen(function* () {
    const stdio = yield* Stdio.Stdio
    yield* parts.pipe(
      Stream.filter((part) => part.type === "text-delta"),
      Stream.map((part) => part.delta),
      Stream.run(stdio.stdout({ endOnDone: false })),
    )
    // the last streamed delta carries no trailing newline
    yield* Console.log("\n")
  })

Effect.gen(function* () {
  const provider = yield* Model.ProviderName
  const modelName = yield* Model.ModelName
  yield* Console.log(`── ${provider}/${modelName}, paid per request over x402 ──\n`)

  const chat = yield* Chat.empty
  yield* chat.streamText({ prompt: "Tell me a knock knock joke." }).pipe(printText)

  yield* chat.generateText({
    prompt: "What's the weather in Tokyo? Use the get_weather tool.",
    toolkit: WeatherToolkit,
  })
  yield* chat.streamText({ prompt: [], toolkit: WeatherToolkit }).pipe(printText)

  const forecast = yield* chat.generateObject({
    prompt: "Summarize that weather report as a forecast object.",
    objectName: "forecast",
    schema: Forecast,
  })
  yield* Console.log(forecast.value)
}).pipe(
  Effect.provide([
    BlockRun.model({ model: "openai/gpt-4o-mini", maxTokens: 1024, temperature: 0.3 }),
    WeatherHandlers,
    Headless.layerConfig(Mnemonic.config("SEED_PHRASE"), KnownAsset),
    NodeStdio.layer,
  ]),
  Effect.runPromise,
)
