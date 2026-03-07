import { Config, Context, Effect, Layer } from "effect"

import { tag } from "./tag.ts"

export declare namespace CrosshatchEnv {
  export type Service = {
    readonly dev: boolean
    readonly domain: string
    readonly url: string
  }
}

export class CrosshatchEnv extends Context.Tag(tag("CrosshatchEnv"))<CrosshatchEnv, CrosshatchEnv.Service>() {}

// TODO: move to internal util
export const isCrosshatch = (origin: string) => CrosshatchEnv.pipe(Effect.map(({ url }) => origin === url))

export const layer = Effect.gen(function* () {
  const dev = yield* Config.boolean("DEV").pipe(Config.withDefault(true))
  const domain = `${dev ? "local." : ""}x.crosshatch.dev`
  const url = `https://${domain}`
  return { dev, domain, url } as const
}).pipe(Layer.effect(CrosshatchEnv))

export const href = (subpath: string) => CrosshatchEnv.pipe(Effect.map(({ url }) => `${url}/${subpath}`))
