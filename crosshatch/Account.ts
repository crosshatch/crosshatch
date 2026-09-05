import { Schema as S, type Pipeable, Predicate, SchemaGetter } from "effect"

import * as Proto from "./_Proto.ts"
import { AddressString } from "./Address.ts"
import { ChainFromString } from "./Chain.ts"

const TypeId = Proto.id("Account")

export type AccountFields = typeof AccountFields.Type
export const AccountFields = S.Struct({
  chain: ChainFromString,
  address: AddressString,
})

export interface Account extends AccountFields, Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId
}

export const isAccount = (v: unknown): v is Account => Predicate.hasProperty(v, TypeId)

export const make = (v: AccountFields): Account => ({ ...Proto.make(TypeId), ...v })

export const AccountFromString = S.TemplateLiteralParser([ChainFromString, ":", AddressString]).pipe(
  S.decodeTo(S.declare(isAccount), {
    decode: SchemaGetter.transform(([chain, _1, address]) => make({ chain, address })),
    encode: SchemaGetter.transform(({ chain, address }) => [chain, ":", address]),
  }),
)
