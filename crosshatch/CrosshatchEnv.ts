import { Config, Context, Effect, Layer } from "effect"

import { ContextKeys } from "./ContextKeys.ts"

export class CrosshatchEnv extends Context.Tag(ContextKeys.CrosshatchEnv)<
  CrosshatchEnv,
  {
    readonly dev: boolean
    readonly domain: string
    readonly url: string
    readonly isCrosshatch: (origin: string) => boolean
    readonly href: (subpath: string) => string
  }
>() {
  static readonly layer = Effect.gen(function* () {
    const dev = yield* Config.boolean("DEV").pipe(Config.withDefault(true))
    const domain = `${dev ? "local." : ""}crosshatch.dev`
    const url = `https://${domain}`
    return {
      dev,
      domain,
      href: (subpath: string) => `${url}/${subpath}`,
      isCrosshatch: (origin: string) => origin === url,
      url,
    } as const
  }).pipe(Layer.effect(CrosshatchEnv))
}
