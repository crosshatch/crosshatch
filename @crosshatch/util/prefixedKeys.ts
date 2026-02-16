import { Record } from "effect"

export const prefixedKeys = <K extends string, T extends Record<string, boolean>>(prefix: K, lookup: T) =>
  Record.map(lookup, (_v, k) => `${prefix}/${k}` as const) as {
    [_ in Extract<keyof T, string>]: `${string}/${_}`
  }
