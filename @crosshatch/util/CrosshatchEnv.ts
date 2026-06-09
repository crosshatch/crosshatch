import { Config, Context, Effect, Layer } from "effect"

export const CROSSHATCH_DOMAIN = "crosshatch.dev"
export const CROSSHATCH_URL = `https://${CROSSHATCH_DOMAIN}`

export const CROSSHATCH_ID_URL = `https://id.${CROSSHATCH_DOMAIN}`

export class CrosshatchEnv extends Context.Service<
  CrosshatchEnv,
  {
    readonly dev: boolean
    readonly domain: string
    readonly url: (sub: string | undefined, pathname?: string | undefined) => string
  }
>()("CrosshatchEnv", {
  make: Effect.gen(function* () {
    const dev =
      "env" in import.meta
        ? // @ts-ignore
          (import.meta.env.VITE_PUBLIC_CROSSHATCH_DEV ?? false)
        : yield* Config.withDefault(Config.boolean("CROSSHATCH_DEV"), false)
    const domain = `${CROSSHATCH_DOMAIN}${dev ? ".localhost" : ""}`
    const url = (sub: string | undefined, pathname?: string | undefined) =>
      `https://${sub ? `${sub}.` : ""}${domain}${pathname ? `/${pathname}` : ""}`
    return { dev, domain, url } as const
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
