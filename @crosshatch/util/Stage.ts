import { Config, Effect, Option, Schema as S } from "effect"

export const StageName = S.Union([
  S.TemplateLiteral(["dev_", S.String]),
  S.TemplateLiteral(["staging-", S.Number]),
  S.Literal("prod"),
])

export interface Stage {
  readonly name: typeof StageName.Type
  readonly domain: (pathname?: string) => string
  readonly url: (pathname?: string) => string
}

const make = (name: typeof StageName.Type) => {
  const domain = (pathname?: string) =>
    `${name.startsWith("staging-") ? `${name}.` : ""}crosshatch.dev${name.startsWith("dev_") ? ".localhost" : ""}${pathname ? `/${pathname}` : ""}`

  const url = (pathname?: string) => `https://${domain(pathname)}`

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
