import { Config, Context, Effect, Layer } from "effect"

import { tag } from "./tag.ts"

export class CrosshatchChatEnv extends Context.Tag(tag("CrosshatchChatEnv"))<
  CrosshatchChatEnv,
  {
    readonly dev: boolean
    readonly shapes: string
  }
>() {
  static readonly layer = Effect.gen(function* () {
    const dev = yield* Config.boolean("DEV").pipe(Config.withDefault(true))
    const shapes = `https://${dev ? "local." : ""}shapes.sh/openai`
    return { dev, shapes } as const
  }).pipe(Layer.effect(CrosshatchChatEnv))
}
