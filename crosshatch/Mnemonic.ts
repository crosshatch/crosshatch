import { flow, Redacted, Effect, Schema as S, Config } from "effect"
import { Mnemonic as OxMnemonic } from "ox"

export const MnemonicText = S.String.check(
  S.isPattern(/^(?:(?:[a-z]+ ){11}|(?:[a-z]+ ){14}|(?:[a-z]+ ){17}|(?:[a-z]+ ){20}|(?:[a-z]+ ){23})[a-z]+$/),
).pipe(S.brand("crosshatch/Mnemonic"))

export const Mnemonic = S.Redacted(MnemonicText)

export const make = flow(MnemonicText.make, Redacted.make)

export const config = flow(Config.string, Config.map(make))

export const random = Effect.sync(() => make(OxMnemonic.random(OxMnemonic.english)))
