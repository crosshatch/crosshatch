import { Pipeable } from "effect"

import * as Proto from "./_Proto.ts"
import type * as Unit from "./Unit.ts"

const TypeId = Proto.id("Representation")

export interface Representation<U extends Unit.Any, K extends string> {
  readonly [TypeId]: typeof TypeId

  readonly unit: U

  readonly symbol: K
}

export type Any = Representation<Unit.Any, string>

export type RepresentationClass<U extends Unit.Any, K extends string> = new () => Representation<U, K>

export const Class = <U extends Unit.Any, K extends string>(options: {
  readonly unit: U
  readonly symbol: K
}): RepresentationClass<U, K> => {
  const { unit, symbol } = options
  return class extends Pipeable.Class {
    readonly [TypeId] = TypeId

    readonly unit = unit

    readonly symbol = symbol
  }
}
