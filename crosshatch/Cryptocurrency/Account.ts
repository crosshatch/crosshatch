import { Schema as S, SchemaGetter } from "effect"

import { Address } from "./Address.ts"
import { Chain, ChainFromString } from "./Chain.ts"

export const AccountPartsFromString = S.TemplateLiteralParser([ChainFromString, ":", Address])

export class Account extends S.Class<Account>("Account")({
  chain: Chain,
  address: Address,
}) {}

export const AccountFromString = AccountPartsFromString.pipe(
  S.decodeTo(S.toType(Account), {
    decode: SchemaGetter.transform(([chain, _1, address]) => ({ chain, address })),
    encode: SchemaGetter.transform(({ address, chain }) => [chain, ":", address]),
  }),
)
