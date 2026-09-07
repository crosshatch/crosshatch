import { Schema as S, SchemaGetter } from "effect"

import * as Proto from "./_Proto.ts"
import * as Address from "./Address.ts"
import { ChainFromString } from "./Chain.ts"

const TypeId = Proto.id("Account")

export const AccountPartsFromString = S.TemplateLiteralParser([ChainFromString, ":", AddressString])

export class Account extends S.Class<Account>("Account")({
  [TypeId]: S.tagDefaultOmit(TypeId),
  chain: ChainFromString,
  address: Address.AddressFromString,
}) {}

export const AccountFromString = AccountPartsFromString.pipe(
  S.decodeTo(Account, {
    decode: SchemaGetter.transform(([chain, _1, address]) =>
      Account.make(
        {
          chain,
          address: Address.make(address),
        },
        { disableChecks: true },
      ),
    ),
    encode: SchemaGetter.transform(({ chain, address }) =>
      AccountPartsFromString.make([chain as never, ":", address as never], { disableChecks: true }),
    ),
  }),
)

type T = typeof AccountFromString.Encoded
