import { flow, Redacted, Effect, Schema as S, Config } from "effect"
import { Mnemonic } from "ox"

export const Phrase = S.String.check(
  S.isPattern(/^(?:(?:[a-z]+ ){11}|(?:[a-z]+ ){14}|(?:[a-z]+ ){17}|(?:[a-z]+ ){20}|(?:[a-z]+ ){23})[a-z]+$/),
).pipe(S.brand("Phrase"))

export const PhraseRedacted = S.Redacted(Phrase)

export const config = flow(Config.string, Config.map(flow(Phrase.make, Redacted.make)))

export const fromText = (text: string) => Redacted.make(Phrase.make(text))

export const random = Effect.sync(() => fromText(Mnemonic.random(Mnemonic.english)))
