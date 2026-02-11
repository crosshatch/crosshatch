import { Layer, Logger, LogLevel } from "effect"

export const layerLogger = (dev?: boolean) =>
  dev
    ? Layer.mergeAll(
      Logger.pretty,
      Logger.minimumLogLevel(LogLevel.Debug),
    )
    : Layer.empty
