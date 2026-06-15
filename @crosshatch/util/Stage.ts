import { Layer, Config, Context, Effect, Schema as S } from "effect"

export interface PathConfig {
  readonly sub?: string | undefined
  readonly pathname?: string | undefined
}

export class Stage extends Context.Service<
  Stage,
  {
    readonly stage: `dev_${string}` | `staging_${number}` | "main"
    readonly domain: (config?: PathConfig | undefined) => string
    readonly url: (config?: PathConfig | undefined) => string
  }
>()("@crosshatch/util/Stage") {}

export const layerConfig = Effect.gen(function* () {
  const decode = S.decodeUnknownEffect(
    S.Union([S.TemplateLiteral(["dev_", S.String]), S.TemplateLiteral(["staging_", S.Number]), S.Literal("main")]),
  )
  const stage =
    "env" in import.meta
      ? // @ts-ignore
        yield* decode(import.meta.env.VITE_PUBLIC_STAGE)
      : yield* Config.string("STAGE").pipe(Effect.flatMap(decode))

  const domain = ({ sub, pathname }: PathConfig = {}) =>
    `${stage.startsWith("staging_") ? `${stage}.` : ""}${sub ? `${sub}.` : ""}crosshatch.dev${stage.startsWith("dev_") ? ".localhost" : undefined}${pathname ? `/${pathname}` : ""}`

  const url = (config?: PathConfig | undefined) => `https://${domain(config)}`

  return { stage, domain, url }
}).pipe(Layer.effect(Stage))
