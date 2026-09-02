import { Effect, Schema as S, SchemaGetter } from "effect"

import * as Address from "./Address.ts"
import * as Chain from "./Chain.ts"

const TypeId = "~crosshatch/AccountId" as const

export type Account = typeof Account.Type
export const Account = S.Struct({
  [TypeId]: S.tag(TypeId),
  chain: Chain.ChainFromString,
  address: Address.Address,
})

export type AccountParts = typeof AccountParts.Type
export const AccountParts = S.TemplateLiteralParser([Chain.ChainFromString, ":", Address.Address])

export type AccountFromString = typeof AccountFromString.Type
export const AccountFromString = AccountParts.pipe(
  S.decodeTo(Account, {
    decode: SchemaGetter.transformOrFail(([chain, _1, address]) =>
      S.encodeEffect(Account)({ [TypeId]: TypeId, chain, address }).pipe(Effect.mapError((e) => e.issue)),
    ),
    encode: SchemaGetter.transformOrFail(({ chain, address }) =>
      S.decodeEffect(AccountParts)(`${chain}:${address}`).pipe(Effect.mapError((e) => e.issue)),
    ),
  }),
)
