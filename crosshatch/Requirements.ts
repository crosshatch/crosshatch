import { type Pipeable, Predicate, Schema as S, SchemaGetter } from "effect"

import * as Proto from "./_Proto.ts"
import { AddressFromString } from "./Address.ts"
import { Atomic } from "./Atomic.ts"
import { ChainFromString } from "./Chain.ts"

const TypeId = Proto.id("Requirements")

export type RequirementsFields = typeof RequirementsFields.Type
export const RequirementsFields = S.Struct({
  amount: Atomic,
  asset: AddressFromString,
  extra: S.JsonObject.pipe(S.optional),
  maxTimeoutSeconds: S.Int.check(S.isGreaterThan(0)),
  network: ChainFromString,
  payTo: AddressFromString,
  scheme: S.Literals(["exact", "upto"]),
})

export interface Requirements extends RequirementsFields, Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId
}

export const isRequirements = (v: unknown): v is Requirements => Predicate.hasProperty(v, TypeId)

export const make = (v: RequirementsFields): Requirements => ({ ...Proto.make(TypeId), ...v })

export const Requirements = RequirementsFields.pipe(
  S.decodeTo(S.declare(isRequirements), {
    decode: SchemaGetter.transform(make),
    encode: SchemaGetter.transform(({ amount, asset, extra, maxTimeoutSeconds, network, payTo, scheme }) => ({
      amount,
      asset,
      extra,
      maxTimeoutSeconds,
      network,
      payTo,
      scheme,
    })),
  }),
)
