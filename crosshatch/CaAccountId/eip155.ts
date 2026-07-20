import { Effect, Option, Schema as S } from "effect"

import { Eip155Address } from "../Eip155/Eip155Address.ts"
import * as CaAccountId from "./CaAccountId.ts"

const reference = S.String.check(S.isPattern(/^\d+$/u)).pipe(
  S.decodeTo(S.FiniteFromString),
  S.check(S.isInt(), S.isGreaterThan(0)),
)

export const eip155ChainId = S.TemplateLiteralParser(["eip155:", reference])

const decode = S.decodeUnknownOption(eip155ChainId)

export const builder: CaAccountId.Builder = {
  supports: (chainId) => Option.isSome(decode(chainId)),
  accountId: Effect.fnUntraced(
    function* (chainId: string, address: string) {
      const [, reference] = yield* S.decodeUnknownEffect(eip155ChainId)(chainId)
      const eip155Address = yield* S.decodeUnknownEffect(Eip155Address)(address)
      return CaAccountId.CaAccountId.make(`eip155:${reference}:${eip155Address.toLowerCase()}`)
    },
    Effect.mapError((cause) => new CaAccountId.CaAccountIdError({ cause })),
  ),
}
