import { Predicate, type Pipeable } from "effect"

import * as Proto from "./_Proto.ts"

const TypeId = Proto.id("Unit")

export interface Unit<K extends string> extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  readonly "~unit": K
}

export type Any = Unit<string>

export const make = <K extends string>(name: K): Unit<K> => ({ ...Proto.make(TypeId), "~unit": name })

export const isUnit = (v: unknown): v is Any => Predicate.hasProperty(v, TypeId)
