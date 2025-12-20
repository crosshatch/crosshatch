import { Atom } from "@effect-atom/atom-react"

export const assign = (get: Atom.FnContext) =>
<R extends Record<keyof any, any>, W extends R>(
  atom: Atom.Writable<R, W>,
  fields: Partial<W>,
) => get.set(atom, { ...get(atom), ...fields })
