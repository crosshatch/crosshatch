import { Context, Config, Effect, Option, Schema as S, Layer } from "effect"

export type Stage = typeof Stage.Type
export const Stage = S.Union([
  S.TemplateLiteral(["dev_", S.String]),
  S.TemplateLiteral(["staging-", S.Finite]),
  S.Literal("prod"),
])

export interface UrlConfig {
  readonly sub?: string | undefined
  readonly pathname?: string | undefined
}

export class Env extends Context.Service<
  Env,
  {
    readonly stage: Stage
    readonly domain: (config?: UrlConfig) => string
    readonly url: (config?: UrlConfig) => string
  }
>()("crosshatch/Env") {}

export const layerFromHostname = (hostname: string) =>
  Layer.effect(
    Env,
    Effect.gen(function* () {
      const raw =
        (import.meta as { readonly env?: undefined | { readonly VITE_PUBLIC_STAGE?: string | undefined } }).env
          ?.VITE_PUBLIC_STAGE ??
        (yield* Config.string("VITE_PUBLIC_STAGE").pipe(
          Config.option,
          Config.map(Option.getOrUndefined),
          Effect.catchTags({
            ConfigError: Effect.die,
          }),
        ))
      const stage = yield* S.decodeUnknownEffect(Stage)(raw).pipe(Effect.orElseSucceed(() => "prod" as const))
      const domain = (config?: UrlConfig) => {
        const { sub, pathname } = config ?? {}
        return `${stage.startsWith("staging-") ? `${stage}.` : ""}${sub ? `${sub}.` : ""}${hostname}${stage.startsWith("dev_") ? ".localhost" : ""}${pathname ? `/${pathname}` : ""}`
      }
      const url = (config?: UrlConfig) => `https://${domain(config)}`
      return { stage, domain, url }
    }),
  )
