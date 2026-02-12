import { Atom } from "@effect-atom/atom-react"
import { Layer, Logger, LogLevel } from "effect"
import * as ConfigProvider from "effect/ConfigProvider"

Atom.runtime.addGlobalLayer(
  Layer.mergeAll(
    Layer.setConfigProvider(
      ConfigProvider.fromJson((import.meta as any).env as never),
    ),
    Logger.pretty,
    Logger.minimumLogLevel(LogLevel.Debug),
  ),
)
