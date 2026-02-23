import { Data } from "effect"

export class DuplicateTagError extends Data.TaggedError("DuplicateTagError")<{
  tag: string
}> {}

const visited = new Set<string>()

export const TagScope = <A extends string>(a: A): (<B extends string>(value: B) => `${A}:${B}`) => {
  return (b) => {
    const tag = `${a}:${b}` as const
    if (visited.has(tag)) {
      throw new DuplicateTagError({ tag })
    }
    visited.add(tag)
    return tag
  }
}
