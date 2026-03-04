import { Config, Context, Effect, Layer } from "effect"

import { tag } from "./tag.ts"

export class CrosshatchEnv extends Context.Tag(tag("CrosshatchEnv"))<
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
    const domain = `${dev ? "local." : ""}x.crosshatch.dev`
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
