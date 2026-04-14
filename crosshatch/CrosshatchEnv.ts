import { Config, Context, Effect, Layer } from "effect"

export declare namespace CrosshatchEnv {
  export type Service = {
    readonly dev: boolean
    readonly domain: string
    readonly url: string
  }
}

export class CrosshatchEnv extends Context.Service<CrosshatchEnv, CrosshatchEnv.Service>()("CrosshatchEnv") {}

export const isCrosshatch = (origin: string) => CrosshatchEnv.asEffect().pipe(Effect.map(({ url }) => origin === url))

export const layer = Effect.gen(function* () {
  const dev = yield* Config.boolean("DEV").pipe(Config.withDefault(true))
  const domain = `crosshatch.dev${dev ? ".localhost" : ""}`
  const url = `https://${domain}`
  return { dev, domain, url } as const
}).pipe(Layer.effect(CrosshatchEnv))

export const href = (subpath: string) => CrosshatchEnv.asEffect().pipe(Effect.map(({ url }) => `${url}/${subpath}`))
