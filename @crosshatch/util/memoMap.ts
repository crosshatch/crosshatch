import { Effect, Layer } from "effect"

export const memoMap = Layer.makeMemoMap.pipe(Effect.runSync)
