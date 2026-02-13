import { Atom } from "@effect-atom/atom-react"
import { Layer, Logger, LogLevel } from "effect"
import * as ConfigProvider from "effect/ConfigProvider"

Atom.runtime.addGlobalLayer(
  Layer.mergeAll(
    Logger.pretty,
    Logger.minimumLogLevel(LogLevel.Debug),
  ).pipe(Layer.provideMerge(
    Layer.setConfigProvider(
      ConfigProvider.fromJson((import.meta as any).env),
    ),
  )),
)
