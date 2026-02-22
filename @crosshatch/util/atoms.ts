import { Atom } from "@effect-atom/atom"
import { Stream } from "effect"

export const currentDateAtom = Atom.make(Stream.tick("1 seconds").pipe(Stream.map(() => new Date()))).pipe(
  Atom.keepAlive,
)
