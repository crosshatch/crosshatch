import * as Proto from "./_Proto.ts"

const TypeId = Proto.id("Unit")

export interface Unit<K extends string> {
  readonly [TypeId]: typeof TypeId

  readonly name: K
}

export type Any = Unit<string>
