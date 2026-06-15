import { Layer, Config, Context, Effect, Schema as S } from "effect"

export interface PathConfig {
  readonly sub?: string | undefined
  readonly pathname?: string | undefined
}

export class Stage extends Context.Service<
  Stage,
  {
    readonly stage: `dev_${string}` | `staging-${number}` | "prod"
    readonly domain: (config?: PathConfig | undefined) => string
    readonly url: (config?: PathConfig | undefined) => string
  }
>()("@crosshatch/util/Stage") {}

export const layerConfig = Effect.gen(function* () {
  const raw =
    (import.meta as { readonly env?: undefined | { VITE_PUBLIC_STAGE?: string | undefined } }).env?.VITE_PUBLIC_STAGE ??
    (yield* Config.string("STAGE"))
  const stage = yield* S.decodeUnknownEffect(
    S.Union([S.TemplateLiteral(["dev_", S.String]), S.TemplateLiteral(["staging-", S.Number]), S.Literal("prod")]),
  )(raw)
  const domain = ({ sub, pathname }: PathConfig = {}) =>
    `${stage.startsWith("staging-") ? `${stage}.` : ""}${sub ? `${sub}.` : ""}crosshatch.dev${stage.startsWith("dev_") ? ".localhost" : ""}${pathname ? `/${pathname}` : ""}`

  const url = (config?: PathConfig | undefined) => `https://${domain(config)}`

  return { stage, domain, url }
}).pipe(Layer.effect(Stage))
