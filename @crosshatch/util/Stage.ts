import { Config, Effect, Option, Schema as S } from "effect"

export const StageName = S.Union([
  S.TemplateLiteral(["dev_", S.String]),
  S.TemplateLiteral(["staging-", S.Number]),
  S.Literal("prod"),
])

export interface PathConfig {
  readonly sub?: string | undefined
  readonly pathname?: string | undefined
}

export interface Stage {
  readonly name: typeof StageName.Type
  readonly domain: (config?: PathConfig) => string
  readonly url: (config?: PathConfig) => string
}

const make = (name: typeof StageName.Type) => {
  const domain = ({ sub, pathname }: PathConfig = {}) =>
    `${name.startsWith("staging-") ? `${name}.` : ""}${sub ? `${sub}.` : ""}crosshatch.dev${name.startsWith("dev_") ? ".localhost" : ""}${pathname ? `/${pathname}` : ""}`

  const url = (config?: PathConfig | undefined) => `https://${domain(config)}`

  return { name, domain, url }
}

let stage_: Stage | undefined
export const Stage = Effect.gen(function* () {
  if (!stage_) {
    const raw =
      (import.meta as { readonly env?: undefined | { VITE_PUBLIC_CROSSHATCH_STAGE?: string | undefined } }).env
        ?.VITE_PUBLIC_CROSSHATCH_STAGE ??
      (yield* Config.string("CROSSHATCH_STAGE").pipe(
        Config.option,
        Config.map(Option.getOrUndefined),
        Effect.catchTags({
          ConfigError: Effect.die,
        }),
      ))
    const name = yield* S.decodeUnknownEffect(StageName)(raw).pipe(Effect.catch(() => Effect.succeed("prod" as const)))
    stage_ = make(name)
  }
  return stage_
})
