import { Config, Effect, Layer, ManagedRuntime, Redacted } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import * as EvmChain from "../Evm/EvmChain.ts"
import * as Payer from "../Payer.ts"
import type { PhysicalAssetLookup } from "../PhysicalAsset.ts"
import * as Treasurer from "../Treasurer.ts"
import { makeFetch } from "./makeFetch.ts"

export const fromMnemonic = (mnemonic: Redacted.Redacted<string>, supported: PhysicalAssetLookup) =>
  ManagedRuntime.make(
    Payer.layer(EvmChain.fromMnemonic(mnemonic)).pipe(Layer.provide(Treasurer.layerFirstSupported(supported))),
  )

export const fromMnemonicConfig = (
  mnemonicConfig: Config.Config<Redacted.Redacted<string>>,
  supported: PhysicalAssetLookup,
): Effect.Effect<ManagedRuntime.ManagedRuntime<Payer.Payer, never>, Config.ConfigError> =>
  Effect.map(mnemonicConfig, (mnemonic) => fromMnemonic(mnemonic, supported))

export const layer = (mnemonic: Redacted.Redacted<string>, supported: PhysicalAssetLookup): Layer.Layer<never> =>
  Layer.succeed(FetchHttpClient.Fetch, makeFetch(fromMnemonic(mnemonic, supported)))

export const layerConfig = (
  mnemonicConfig: Config.Config<Redacted.Redacted<string>>,
  supported: PhysicalAssetLookup,
): Layer.Layer<never, Config.ConfigError> =>
  Layer.effect(
    FetchHttpClient.Fetch,
    Effect.map(fromMnemonicConfig(mnemonicConfig, supported), (runtime) => makeFetch(runtime)),
  )
