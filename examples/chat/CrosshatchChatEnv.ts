import { Config, Context, Effect, Layer } from "effect"
import { ContextKeys } from "./ContextKeys.ts"

export class CrosshatchChatEnv extends Context.Tag(ContextKeys.CrosshatchChatEnv)<
  CrosshatchChatEnv,
  {
    readonly dev: boolean
    readonly shapes: string
  }
>() {
  static readonly layer = Effect.gen(function* () {
    const dev = yield* Config.boolean("DEV").pipe(Config.withDefault(true))
    const shapes = `https://${dev ? "local." : ""}shapes.sh`
    return { dev, shapes } as const
  }).pipe(Layer.effect(CrosshatchChatEnv))
}
