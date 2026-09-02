import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english.js"
import { Layer, Redacted, Effect, Schema as S, Config, Context, flow } from "effect"

export const MnemonicText = S.String.check(
  S.makeFilter((text) => validateMnemonic(text, wordlist), {
    expected: "a valid BIP-39 English mnemonic",
  }),
).pipe(S.brand("crosshatch/MnemonicText"))

type Mnemonic_ = typeof Mnemonic_.Type
const Mnemonic_ = S.Redacted(MnemonicText)

export const fromRedacted = S.decodeEffect(Mnemonic_)

// oxlint-disable-next-line
export interface Mnemonic extends Mnemonic_ {}

export const Mnemonic = Object.assign(Context.Service<Mnemonic, Mnemonic>()("crosshatch/Mnemonic"), Mnemonic_)

export const layerFromRedacted = flow(fromRedacted, Layer.effect(Mnemonic))

export const toSeed = (mnemonic: Mnemonic) => mnemonicToSeedSync(Redacted.value(mnemonic))

export const fromConfig = (config: string | Config.Config<Redacted.Redacted>) =>
  Config.mapOrFail(
    Config.isConfig(config) ? config : Config.redacted(config),
    flow(
      fromRedacted,
      Effect.mapError((cause) => new Config.ConfigError(cause)),
    ),
  )

export const layerFromConfig = flow(fromConfig, Layer.effect(Mnemonic))

export const random = Effect.sync(() => generateMnemonic(wordlist)).pipe(
  Effect.map(Redacted.make),
  Effect.flatMap(fromRedacted),
)

export const layerFromRandom = Layer.effect(Mnemonic, random)
