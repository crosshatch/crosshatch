import { Schema as S, Pipeable } from "effect"

import * as Proto from "./_Proto.ts"
import { AddressString } from "./Address.ts"
import { ReferenceString } from "./Reference.ts"

const TypeId = Proto.id("Namespace")

export type NamespaceString = typeof NamespaceString.Type
export const NamespaceString = S.String.check(S.isPattern(/^[-a-z0-9]{3,8}$/u)).pipe(S.brand(TypeId))

export interface NamespaceSpec<K extends string, Uniform extends boolean> {
  readonly name: K
  readonly address: {
    readonly uniform: Uniform
    readonly pattern: RegExp
  }
  readonly reference: {
    readonly pattern: RegExp
  }
}

export interface Namespace<K extends string, Uniform extends boolean> extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  readonly id: Proto.id<`namespaces/${K}`>

  readonly _tag: K

  readonly spec: NamespaceSpec<K, Uniform>

  readonly AddressString: S.brand<typeof AddressString, this["id"]>

  readonly ReferenceString: S.brand<typeof ReferenceString, this["id"]>
}

export type Any = Namespace<string, boolean>

export type NamespaceClass<K extends string, Uniform extends boolean> = new () => Namespace<K, Uniform>

export declare namespace NamespaceClass {
  export type Any = NamespaceClass<string, boolean>
}

export const Class = <K extends string, Uniform extends boolean>(
  spec: NamespaceSpec<K, Uniform>,
): NamespaceClass<K, Uniform> => {
  const { name, address, reference } = spec
  return class extends Pipeable.Class {
    readonly [TypeId] = TypeId

    readonly id = Proto.id(`namespaces/${name}`)

    readonly _tag = name

    readonly spec = spec

    readonly AddressString = AddressString.check(S.isPattern(address.pattern)).pipe(S.brand(this.id))

    readonly ReferenceString = ReferenceString.check(S.isPattern(reference.pattern)).pipe(S.brand(this.id))
  }
}
