import { flow, Redacted, Effect, Schema as S, Config } from "effect"
import { Mnemonic as OxMnemonic } from "ox"

export const Mnemonic = S.String.check(
  S.isPattern(/^(?:(?:[a-z]+ ){11}|(?:[a-z]+ ){14}|(?:[a-z]+ ){17}|(?:[a-z]+ ){20}|(?:[a-z]+ ){23})[a-z]+$/),
).pipe(S.brand("crosshatch/Mnemonic"))

export const MnemonicRedacted = S.Redacted(Mnemonic)

export const config = flow(Config.string, Config.map(flow(Mnemonic.make, Redacted.make)))

export const fromText = (text: string) => Redacted.make(Mnemonic.make(text))

export const random = Effect.sync(() => fromText(OxMnemonic.random(OxMnemonic.english)))
