import { NodeServices } from "@effect/platform-node"
import { Effect, Layer } from "effect"

import { Mnemonic, MnemonicStore } from "../index.ts"
import * as HostMnemonicStore from "./HostMnemonicStore.ts"
import * as HostUserConfig from "./HostUserConfig.ts"

export const layer = (name?: string) =>
  Layer.effect(
    Mnemonic.Mnemonic,
    Effect.gen(function* () {
      const store = yield* MnemonicStore.MnemonicStore
      return yield* store.get(name ?? "default")
    }),
  ).pipe(
    Layer.provide(
      HostMnemonicStore.layer.pipe(Layer.provide(HostUserConfig.layer.pipe(Layer.provide(NodeServices.layer)))),
    ),
  )
