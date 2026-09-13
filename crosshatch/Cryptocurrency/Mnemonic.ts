import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english.js"
import { Layer, Redacted, Effect, Schema as S, Config, Context, flow } from "effect"

import * as Proto from "../_Proto.ts"

export type MnemonicString = typeof MnemonicString.Type
export const MnemonicString = S.String.check(
  S.makeFilter((text) => validateMnemonic(text, wordlist), {
    expected: "a valid BIP-39 English mnemonic",
  }),
).pipe(S.brand(Proto.id("Cryptocurrency/MnemonicString")))

export interface Mnemonic extends Mnemonic_ {}
type Mnemonic_ = typeof Mnemonic_.Type
const Mnemonic_ = S.Redacted(MnemonicString)

export const Mnemonic = Object.assign(
  Context.Service<Mnemonic, Mnemonic_>()("crosshatch/Cryptocurrency/Mnemonic"),
  Mnemonic_,
)

export const toSeed = (mnemonic: Mnemonic): Uint8Array => mnemonicToSeedSync(Redacted.value(mnemonic))

const fromRedacted_ = S.decodeEffect(Mnemonic_, { reportInput: true })
export const fromRedacted = (v: Redacted.Redacted) => fromRedacted_(v)

export const fromConfig = (config: string | Config.Config<Redacted.Redacted>): Config.Config<Mnemonic> =>
  Config.mapOrFail(
    Config.isConfig(config) ? config : Config.redacted(config),
    flow(
      fromRedacted,
      Effect.mapError((cause) => new Config.ConfigError(cause)),
    ),
  )

export const layerFromConfig = flow(fromConfig, Layer.effect(Mnemonic))

export const random: Effect.Effect<Mnemonic, S.SchemaError> = Effect.sync(() => generateMnemonic(wordlist)).pipe(
  Effect.map(Redacted.make),
  Effect.flatMap(fromRedacted),
)

export const layerFromRandom: Layer.Layer<Mnemonic, S.SchemaError> = Layer.effect(Mnemonic, random)
