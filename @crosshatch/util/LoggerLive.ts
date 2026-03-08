import { Layer, Logger, LogLevel } from "effect"

export const LoggerLive = Layer.mergeAll(Logger.pretty, Logger.minimumLogLevel(LogLevel.All))
