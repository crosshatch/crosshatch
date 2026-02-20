import { Record, Function } from "effect"

export const prefix = Function.dual<
  <A extends string>(that: A) => <B extends string>(self: B) => `${A}${B}`,
  <A extends string, B extends string>(self: A, that: B) => `${A}${B}`
>(2, (self, that) => `${self}${that}`)

export const prefixLookup = <P extends string, T extends Record<string, true>>(
  p: P,
  lookup: T,
): {
  [K in Extract<keyof T, string>]: `${P}${K}`
} => {
  const f = prefix(p)
  return Record.map(lookup, (_0, k) => f(k)) as never
}
