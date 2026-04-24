import { Config, Context, Effect, Layer } from "effect"

export const CROSSHATCH_DOMAIN = "crosshatch.dev"
export const CROSSHATCH_URL = `https://${CROSSHATCH_DOMAIN}`

export class InternalEnv extends Context.Service<
  InternalEnv,
  {
    readonly dev: boolean
    readonly domain: string
    readonly url: string
  }
>()("InternalEnv", {
  make: Effect.gen(function* () {
    const dev =
      "env" in import.meta
        ? !!(
            (import.meta as never as { env: { VITE_PUBLIC_CROSSHATCH_DEV?: unknown } }).env
              .VITE_PUBLIC_CROSSHATCH_DEV ?? false
          )
        : yield* Config.boolean("CROSSHATCH_DEV").pipe(Config.withDefault(false))
    const domain = `${CROSSHATCH_DOMAIN}${dev ? ".localhost" : ""}`
    const url = `https://${domain}`
    return { dev, domain, url } as const
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)

  static readonly href = (subpath: string) => this.asEffect().pipe(Effect.map(({ url }) => `${url}/${subpath}`))

  static readonly isCrosshatch = (origin: string) =>
    origin === CROSSHATCH_URL || origin === `${CROSSHATCH_URL}.localhost`
}
