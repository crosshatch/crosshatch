import { Layer, Logger, LogLevel } from "effect"

export const PreludeLive = Layer.mergeAll(Logger.pretty, Logger.minimumLogLevel(LogLevel.All))
