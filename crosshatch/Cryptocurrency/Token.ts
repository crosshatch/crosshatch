import * as Proto from "../_Proto.ts"

const TypeId = Proto.id("Token")

export interface TokenSpec<K extends string> {
  readonly symbol: K
}

export interface Token<K extends string> extends TokenSpec<K> {
  readonly [TypeId]: typeof TypeId
}

export type Any = Token<string>

export const make = <K extends string>(spec: TokenSpec<K>): Token<K> => ({
  [TypeId]: TypeId,
  ...spec,
})
