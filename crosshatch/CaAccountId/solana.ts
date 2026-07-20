import { Effect, Option, Schema as S } from "effect"

import { Reference } from "../Reference.ts"
import { SolanaAddress } from "../Solana/SolanaAddress.ts"
import * as CaAccountId from "./CaAccountId.ts"

const reference = S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/u))

export const solanaChainId = S.TemplateLiteralParser(["solana:", reference])

const decode = S.decodeUnknownOption(solanaChainId)

export const builder: CaAccountId.Builder = {
  supports: (chainId) => Option.isSome(decode(chainId)),
  accountId: Effect.fnUntraced(
    function* (chainId: string, address: string) {
      const [, reference] = yield* S.decodeUnknownEffect(solanaChainId)(chainId)
      const validatedAddress = yield* S.decodeUnknownEffect(SolanaAddress)(address)
      const validatedReference = yield* S.decodeUnknownEffect(Reference)(reference)
      return CaAccountId.CaAccountId.make(`solana:${validatedReference}:${validatedAddress}`)
    },
    Effect.mapError((cause) => new CaAccountId.CaAccountIdError({ cause })),
  ),
}
