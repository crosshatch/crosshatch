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

// oxlint-disable-next-line
export interface Mnemonic extends Mnemonic_ {}

export const Mnemonic = Object.assign(Context.Service<Mnemonic, Mnemonic>()("crosshatch/Mnemonic"), Mnemonic_)

export const fromText = (text: string) => Redacted.make(MnemonicText.make(text))

export const toSeed = (mnemonic: Mnemonic) => mnemonicToSeedSync(Redacted.value(mnemonic))

export const layerFromText = flow(fromText, Layer.succeed(Mnemonic))

export const fromConfig = (config: Config.Config<string>) => Config.map(config, fromText)

export const layerFromConfig = flow(fromConfig, Layer.effect(Mnemonic))

export const fromEnv = fromConfig(Config.string("MNEMONIC"))

export const layerFromEnv = Layer.effect(Mnemonic, fromEnv)

export const random = Effect.sync(() =>
  Redacted.make(MnemonicText.make(generateMnemonic(wordlist), { disableChecks: true })),
)

export const layerRandom = Layer.effect(Mnemonic, random)
