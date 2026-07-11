import { Layer, Redacted, Effect, Schema as S, Config, Context, Brand, flow } from "effect"
import { Mnemonic as OxMnemonic } from "ox"

export const MnemonicText = S.String.check(
  S.isPattern(/^(?:(?:[a-z]+ ){11}|(?:[a-z]+ ){14}|(?:[a-z]+ ){17}|(?:[a-z]+ ){20}|(?:[a-z]+ ){23})[a-z]+$/),
).pipe(S.brand("crosshatch/Mnemonic"))

const ID = "crosshatch/Mnemonic" as const

type Mnemonic_ = [Redacted.Redacted<string & Brand.Brand<typeof ID>>][0]

export interface Mnemonic extends S.Redacted<S.brand<S.String, typeof ID>>, Context.Service<Mnemonic, Mnemonic_> {
  new (_: never): Context.ServiceClass.Shape<typeof ID, Mnemonic_>
}

export const Mnemonic: Mnemonic = Object.assign(Context.Service<Mnemonic, Mnemonic_>()(ID), S.Redacted(MnemonicText))

export const fromText = (text: string) => Redacted.make(MnemonicText.make(text))

export const layerText = flow(fromText, Layer.succeed(Mnemonic))

export const fromConfig = (config: Config.Config<string>) => Config.map(config, fromText)

export const layerConfig = flow(fromConfig, Layer.effect(Mnemonic))

export const env = fromConfig(Config.string("MNEMONIC"))

export const layerEnv = Layer.effect(Mnemonic, env)

export const random = Effect.sync(() => fromText(OxMnemonic.random(OxMnemonic.english)))

export const layerRandom = Layer.effect(Mnemonic, random)
