import { Effect, Layer } from "effect"

export const withLogging = <ROut, E, RIn>(self: Layer.Layer<ROut, E, RIn>) => self.pipe(Layer.tapError(Effect.logError))
