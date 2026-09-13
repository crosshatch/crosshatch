import { type Brand, Schema as S } from "effect"

import * as Proto from "../_Proto.ts"
import { Address } from "./Address.ts"

const TypeId = Proto.id("Namespace")

export interface NamespaceSpec<K extends string, U extends boolean> {
  /** CAIP namespace name. */
  readonly _tag: K

  readonly reference: {
    /** The pattern with which to validate references. */
    readonly pattern: RegExp
  }

  readonly address: {
    /** Whether addresses are constant across references. */
    readonly uniform: U
    /** The pattern with which to validate address strings. */
    readonly pattern: RegExp
  }
}

export interface Namespace<K extends string, U extends boolean> extends NamespaceSpec<K, U> {
  readonly [TypeId]: typeof TypeId

  readonly Address: S.brand<typeof Address, Proto.id<`namespaces/${K}`>>
}

export type Any = Namespace<string, boolean>

export const make = <K extends string, U extends boolean>(fields: NamespaceSpec<K, U>): Namespace<K, U> => ({
  [TypeId]: TypeId,
  ...fields,
  Address: Address.check(S.isPattern(fields.address.pattern)).pipe(S.brand(Proto.id(`namespaces/${fields._tag}`))),
})

export type NamespaceBrand<K extends string> = [Brand.Brand<Proto.id<`namespaces/${K}`>>][0]
