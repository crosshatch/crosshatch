import * as Proto from "./_Proto.ts"

const TypeId = Proto.id("Unit")

export interface Unit<K extends string> {
  readonly [TypeId]: typeof TypeId

  readonly name: K
}

export type Any = Unit<string>

export const make = <K extends string>(name: K): Unit<K> => ({ [TypeId]: TypeId, name })
