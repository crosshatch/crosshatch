import { runtime } from "@crosshatch/util/memoMap"
import { resolveEnv } from "@crosshatch/util/resolveEnv"
import { Atom } from "@effect-atom/atom-react"
import { Layer, Logger, LogLevel, ConfigProvider } from "effect"

const PreludeLive = Layer.mergeAll(Logger.pretty, Logger.minimumLogLevel(LogLevel.Debug)).pipe(
  Layer.provideMerge(Layer.setConfigProvider(ConfigProvider.fromJson(resolveEnv()))),
)

// TODO: both necessary?
Atom.runtime.addGlobalLayer(PreludeLive)
runtime.addGlobalLayer(PreludeLive)
