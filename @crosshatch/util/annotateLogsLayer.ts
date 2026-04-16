import { References, Effect, Layer } from "effect"

export const annotateLogsLayer = (annotations: Record<string, unknown>) =>
  Layer.provideMerge(
    Layer.effect(
      References.CurrentLogAnnotations,
      Effect.map(References.CurrentLogAnnotations.asEffect(), (existing) => ({ ...existing, ...annotations })),
    ),
  )
