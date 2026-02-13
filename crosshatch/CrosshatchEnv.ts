import { prefix } from "@crosshatch/util/prefix"
import { Config, Context, Effect, Layer } from "effect"

export class CrosshatchEnv extends Context.Tag(prefix("util/CrosshatchEnv"))<CrosshatchEnv, {
  readonly dev: boolean
  readonly domain: string
  readonly url: string
  readonly isCrosshatch: (origin: string) => boolean
  readonly href: (subpath: string) => string
}>() {
  static readonly layer = Effect.gen(function*() {
    const dev = yield* Config.boolean("DEV").pipe(
      Config.withDefault(true),
    )
    const domain = `${dev ? "local." : ""}crosshatch.dev`
    const url = `https://${domain}`
    return {
      dev,
      domain,
      url,
      isCrosshatch: (origin: string) => origin === url,
      href: (subpath: string) => `${url}/${subpath}`,
    } as const
  }).pipe(
    Layer.effect(CrosshatchEnv),
  )
}
