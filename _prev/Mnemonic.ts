import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english.js"
import {
  Layer,
  Redacted,
  Effect,
  Schema as S,
  Config,
  Context,
  flow,
  type Pipeable,
  Predicate,
  SchemaGetter,
} from "effect"

import * as Proto from "./_Proto.ts"

const TypeId = Proto.id("Mnemonic")

export type MnemonicString = typeof MnemonicString.Type
export const MnemonicString = S.String.check(
  S.makeFilter((text) => validateMnemonic(text, wordlist), {
    expected: "a valid BIP-39 English mnemonic",
  }),
).pipe(S.brand(TypeId))

export type MnemonicRedacted = typeof MnemonicRedacted.Type
export const MnemonicRedacted = S.Redacted(MnemonicString)

export interface Mnemonic extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  readonly raw: Redacted.Redacted<MnemonicString>
}

export const value = (mnemonic: Mnemonic): MnemonicString => Redacted.value(mnemonic.raw)

export const isMnemonic = (v: unknown): v is Mnemonic => Predicate.hasProperty(v, TypeId)

export const make = (v: MnemonicRedacted): Mnemonic => ({ ...Proto.make(TypeId), raw: v })

export const MnemonicFromRedacted = MnemonicRedacted.pipe(
  S.decodeTo(S.declare(isMnemonic), {
    decode: SchemaGetter.transform((raw) => ({ ...Proto.make(TypeId), raw })),
    encode: SchemaGetter.transform((v) => v.raw),
  }),
)

export const MnemonicFromString = MnemonicString.pipe(S.decodeTo(MnemonicFromRedacted))

const fromRedacted_ = S.decodeEffect(MnemonicFromRedacted)
export const fromRedacted = (v: Redacted.Redacted): Effect.Effect<Mnemonic, S.SchemaError> => fromRedacted_(v)

export const Mnemonic = Object.assign(Context.Service<Mnemonic, Mnemonic>()("crosshatch/Mnemonic"), MnemonicRedacted)

export const layerFromRedacted: (v: Redacted.Redacted) => Layer.Layer<Mnemonic, S.SchemaError> = flow(
  fromRedacted,
  Layer.effect(Mnemonic),
)

export const toSeed = (mnemonic: Mnemonic): Uint8Array => mnemonicToSeedSync(Redacted.value(mnemonic.raw))

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
