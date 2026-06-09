import * as OpenApiGenerator from "@effect/openapi-generator/OpenApiGenerator"
import { NodeServices } from "@effect/platform-node"
import { Effect, FileSystem, Stream } from "effect"
import { FetchHttpClient, HttpClient } from "effect/unstable/http"
import { ChildProcess } from "effect/unstable/process"
import * as Yaml from "yaml"

Effect.gen(function* () {
  const generator = yield* OpenApiGenerator.OpenApiGenerator
  const source = yield* HttpClient.get("https://raw.githubusercontent.com/coinbase/cdp-sdk/main/openapi.yaml").pipe(
    Effect.flatMap((response) => response.text),
  )
  const generated = yield* generator.generate(Yaml.parse(source), {
    name: `CdpClient`,
    format: "httpclient",
  })
  const fs = yield* FileSystem.FileSystem
  const dest = new URL(`./CdpClient.gen.ts`, import.meta.url).pathname
  yield* fs.writeFileString(dest, `// @ts-nocheck\n\n${generated}`)
  const { stdout } = yield* ChildProcess.make`oxfmt`
  yield* stdout.pipe(Stream.runDrain)
}).pipe(
  Effect.scoped,
  Effect.provide([OpenApiGenerator.layerTransformerSchema, NodeServices.layer, FetchHttpClient.layer]),
  Effect.runFork,
)
