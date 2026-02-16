import { Atom } from "@effect-atom/atom-react"
import { Layer, Logger, LogLevel } from "effect"
import * as ConfigProvider from "effect/ConfigProvider"
import { resolveEnv } from "@crosshatch/util/resolveEnv"

Atom.runtime.addGlobalLayer(
  Layer.mergeAll(Logger.pretty, Logger.minimumLogLevel(LogLevel.Debug)).pipe(
    Layer.provideMerge(Layer.setConfigProvider(ConfigProvider.fromJson(resolveEnv()))),
  ),
)
