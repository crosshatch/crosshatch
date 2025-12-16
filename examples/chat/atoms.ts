import { EnclaveClient } from "@crosshatch/react"
import { LoggerLive } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom-react"
import { ConfigProvider, Layer } from "effect"

export const runtime = Atom.runtime(
  Layer.mergeAll(
    LoggerLive,
    EnclaveClient.layer,
  ).pipe(
    Layer.provideMerge(
      Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env)),
    ),
  ),
)
