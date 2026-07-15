import { Context, Config, Effect, Option, Schema as S } from "effect"

export const StageName = S.Union([
  S.TemplateLiteral(["dev_", S.String]),
  S.TemplateLiteral(["staging-", S.Finite]),
  S.Literal("prod"),
])

export interface Stage {
  readonly name: typeof StageName.Type
  readonly domain: (sub?: string, pathname?: string) => string
  readonly url: (sub?: string, pathname?: string) => string
}

const make = (name: typeof StageName.Type) => {
  const domain = (sub?: string, pathname?: string) =>
    `${name.startsWith("staging-") ? `${name}.` : ""}${sub ? `${sub}.` : ""}crosshatch.dev${name.startsWith("dev_") ? ".localhost" : ""}${pathname ? `/${pathname}` : ""}`

  const url = (sub?: string, pathname?: string) => `https://${domain(sub, pathname)}`

  return { name, domain, url }
}

export const Stage = Context.Reference<Stage>("crosshatch/Stage", {
  defaultValue: () =>
    Effect.gen(function* () {
      const raw =
        (import.meta as { readonly env?: undefined | { readonly VITE_PUBLIC_ALCHEMY_STAGE?: string | undefined } }).env
          ?.VITE_PUBLIC_ALCHEMY_STAGE ??
        (yield* Config.string("ALCHEMY_STAGE").pipe(
          Config.option,
          Config.map(Option.getOrUndefined),
          Effect.catchTags({
            ConfigError: Effect.die,
          }),
        ))
      const name = yield* S.decodeUnknownEffect(StageName)(raw).pipe(Effect.orElseSucceed(() => "prod" as const))
      return make(name)
    }).pipe(Effect.runSync),
})
