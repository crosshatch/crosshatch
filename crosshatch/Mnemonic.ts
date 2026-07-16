import { Layer, Redacted, Effect, Schema as S, Config, Context, Brand, flow } from "effect"
import { Mnemonic as OxMnemonic } from "ox"

export const MnemonicText = S.String.check(
  S.isPattern(/^(?:(?:[a-z]+ ){11}|(?:[a-z]+ ){14}|(?:[a-z]+ ){17}|(?:[a-z]+ ){20}|(?:[a-z]+ ){23})[a-z]+$/u),
).pipe(S.brand("crosshatch/Mnemonic"))

const ID = "crosshatch/Mnemonic" as const

// oxlint-disable-next-line
export interface Mnemonic extends Redacted.Redacted<string & Brand.Brand<typeof ID>> {}

export const Mnemonic = Object.assign(Context.Service<Mnemonic, Mnemonic>()(ID), S.Redacted(MnemonicText))

export const fromText = (text: string) => Redacted.make(MnemonicText.make(text))

export const layerText = flow(fromText, Layer.succeed(Mnemonic))

export const fromConfig = (config: Config.Config<string>) => Config.map(config, fromText)

export const layerConfig = flow(fromConfig, Layer.effect(Mnemonic))

export const env = fromConfig(Config.string("MNEMONIC"))

export const layerEnv = Layer.effect(Mnemonic, env)

export const random = Effect.sync(() =>
  Redacted.make(MnemonicText.make(OxMnemonic.random(OxMnemonic.english), { disableChecks: true })),
)

export const layerRandom = Layer.effect(Mnemonic, random)
