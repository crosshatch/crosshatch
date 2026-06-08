import * as OpenApiGenerator from "@effect/openapi-generator/OpenApiGenerator"
import { Effect, FileSystem, Stream } from "effect"
import { Command } from "effect/unstable/cli"
import { FetchHttpClient, HttpClient } from "effect/unstable/http"
import { ChildProcess } from "effect/unstable/process"
import * as Yaml from "yaml"

interface Target {
  readonly format: "json" | "yaml"
  readonly name: string
  readonly spec: string
  readonly outdir: string
}

const targets: ReadonlyArray<Target> = [
  {
    format: "yaml",
    name: "Cdp",
    spec: "https://raw.githubusercontent.com/coinbase/cdp-sdk/main/openapi.yaml",
    outdir: "@crosshatch/facilitator",
  },
]

export const codegen = Command.make("codegen").pipe(
  Command.withHandler(() =>
    Effect.forEach(
      targets,
      Effect.fn(function* ({ format, spec, name, outdir }) {
        const generator = yield* OpenApiGenerator.OpenApiGenerator
        const source = yield* HttpClient.get(spec).pipe(Effect.flatMap((response) => response.text))
        const parsed = format === "json" ? JSON.parse(format) : Yaml.parse(source)
        const generated = yield* generator.generate(parsed, {
          name: `${name}Client`,
          format: "httpclient",
        })
        const fs = yield* FileSystem.FileSystem
        yield* fs.writeFileString(`${outdir}/${name}.ts`, `// @ts-nocheck\n\n${generated}`)
        const { stdout } = yield* ChildProcess.make`oxfmt`
        yield* stdout.pipe(Stream.runDrain)
      }),
      { concurrency: "unbounded" },
    ),
  ),
  Command.provide(OpenApiGenerator.layerTransformerSchema),
  Command.provide(FetchHttpClient.layer),
)
