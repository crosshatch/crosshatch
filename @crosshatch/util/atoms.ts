import { Atom, Registry } from "@effect-atom/atom"
import { useAtomMount, useAtomSuspense } from "@effect-atom/atom-react"
import { Reactivity } from "@effect/experimental"
import { Stream, Scope, Effect } from "effect"
import { useMemo } from "react"

export const currentDateAtom = Atom.make(Stream.tick("1 seconds").pipe(Stream.map(() => new Date()))).pipe(
  Atom.keepAlive,
)

export const useAnonymousAtomMount = <RI, RR, A, E>(
  runtime: Atom.AtomRuntime<RI, RR>,
  f: (get: Atom.FnContext) => Effect.Effect<A, E, RI | Scope.Scope | Registry.AtomRegistry | Reactivity.Reactivity>,
) => {
  const mountAtom = useMemo(() => runtime.atom(f), [])
  useAtomMount(mountAtom)
}

export const useAnonymousAtomSuspense = <RI, RR, A, E>(
  runtime: Atom.AtomRuntime<RI, RR>,
  f: (get: Atom.FnContext) => Effect.Effect<A, E, RI | Scope.Scope | Registry.AtomRegistry | Reactivity.Reactivity>,
) => {
  const mountAtom = useMemo(() => runtime.atom(f), [])
  const result = useAtomSuspense(mountAtom)
  return result
}
