import { Effect, Layer, Logger, LogLevel } from "effect"
import { config } from "./config.ts"

export const LoggerLive = config.dev.pipe(
  Effect.map((dev) =>
    dev
      ? Layer.mergeAll(
        Logger.pretty,
        Logger.minimumLogLevel(LogLevel.Debug),
      )
      : Layer.empty
  ),
  Layer.unwrapEffect,
)
