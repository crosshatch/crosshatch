import { References, Effect, Layer } from "effect"

export const boundLayer = (boundary: string) =>
  Layer.provideMerge(
    Layer.effect(
      References.CurrentLogAnnotations,
      Effect.map(References.CurrentLogAnnotations.asEffect(), (existing) => ({ ...existing, boundary })),
    ).pipe(Layer.tapError(Effect.logError), Layer.provideMerge(Layer.succeed(References.MinimumLogLevel, "All"))),
  )
