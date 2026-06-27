import { Redacted, Effect, Schema as S } from "effect"
import { Mnemonic } from "ox"

export const Phrase = S.String.pipe(S.brand("Phrase"))

export const PhraseRedacted = S.Redacted(Phrase)

export const fromText = (text: string) => Redacted.make(Phrase.make(text))

export const random = Effect.sync(() => fromText(Mnemonic.random(Mnemonic.english)))
