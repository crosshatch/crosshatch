import { BlockRun } from "@crosshatch/ai"
import { NodeStdio } from "@effect/platform-node"
import { Mnemonic } from "crosshatch"
import * as Headless from "crosshatch/Headless"
import * as KnownAsset from "crosshatch/KnownAsset"
import { Console, Effect, Schema as S, Stdio, Stream } from "effect"
import { LanguageModel, Model, Prompt, Tool, Toolkit } from "effect/unstable/ai"

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

Effect.gen(function* () {
  const provider = yield* Model.ProviderName
  const modelName = yield* Model.ModelName
  yield* Console.log(`── ${provider}/${modelName}, paid per request over x402 ──\n`)

  const stdio = yield* Stdio.Stdio
  yield* Console.log("• streaming:")
  yield* LanguageModel.streamText({ prompt: "Tell me a knock knock joke." }).pipe(
    Stream.filter((part) => part.type === "text-delta"),
    Stream.map((part) => part.delta),
    Stream.run(stdio.stdout({ endOnDone: false })),
  )

  yield* Console.log("\n\n• tool calling:")
  const question = "What's the weather in Tokyo? Use the get_weather tool."
  const called = yield* LanguageModel.generateText({ prompt: question, toolkit: WeatherToolkit })
  const answered = yield* LanguageModel.generateText({
    prompt: Prompt.concat(Prompt.make(question), Prompt.fromResponseParts(called.content)),
    toolkit: WeatherToolkit,
  })
  yield* Console.log(answered.text)

  yield* Console.log("\n• structured output:")
  const forecast = yield* LanguageModel.generateObject({
    prompt: "Invent a plausible spring forecast for Reykjavik.",
    objectName: "forecast",
    schema: Forecast,
  })
  yield* Console.log(`${forecast.value.city}: ${forecast.value.temperature}°C, ${forecast.value.conditions}`)
}).pipe(
  Effect.provide([
    BlockRun.model({ model: "openai/gpt-4o-mini", maxTokens: 1024, temperature: 0.3 }),
    WeatherHandlers,
    Headless.layerConfig(Mnemonic.config("SEED_PHRASE"), KnownAsset),
    NodeStdio.layer,
  ]),
  Effect.runPromise,
)
