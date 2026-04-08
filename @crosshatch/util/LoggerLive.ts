import { Effect, Layer, Logger, LogLevel } from "effect"

export const LoggerLive = Layer.mergeAll(Logger.pretty, Logger.minimumLogLevel(LogLevel.All))

export const withLogging = <ROut, E, RIn>(self: Layer.Layer<ROut, E, RIn>) =>
  self.pipe(Layer.tapErrorCause(Effect.logError), Layer.provideMerge(LoggerLive))
