import { Layer, Redacted, Effect, Schema as S, Config } from "effect"
import { Mnemonic as OxMnemonic } from "ox"

import type { AdapterModule } from "./Adapter.ts"

export const MnemonicText = S.String.check(
  S.isPattern(/^(?:(?:[a-z]+ ){11}|(?:[a-z]+ ){14}|(?:[a-z]+ ){17}|(?:[a-z]+ ){20}|(?:[a-z]+ ){23})[a-z]+$/),
).pipe(S.brand("crosshatch/Mnemonic"))

export const Mnemonic = S.Redacted(MnemonicText)

export const make = (text: string) => Redacted.make(MnemonicText.make(text))

export const config = (name: string) => Config.string(name).pipe(Config.map(make))

export const random = Effect.sync(() => make(OxMnemonic.random(OxMnemonic.english)))

export const toLayer =
  <A>(mod: AdapterModule<A>) =>
  (mnemonic: typeof Mnemonic.Type) =>
    mod.layerMnemonic(mnemonic)

export const toLayerText =
  <A>(mod: AdapterModule<A>) =>
  (mnemonicText: string) =>
    toLayer(mod)(make(mnemonicText))

export const toLayerConfig =
  <A>(mod: AdapterModule<A>) =>
  (mnemonicConfig: Config.Config<typeof Mnemonic.Type>) =>
    mnemonicConfig.pipe(Effect.map(mod.layerMnemonic), Layer.unwrap)

export const toLayerEnv = <A>(mod: AdapterModule<A>) => toLayerConfig(mod)(config("MNEMONIC"))
