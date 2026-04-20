import { useAtomMount, useAtomSuspense } from "@effect/atom-react"
import { Stream, Scope, Effect } from "effect"
import { Atom, AtomRegistry, Reactivity } from "effect/unstable/reactivity"
import { useMemo } from "react"

export const currentDateAtom = Atom.make(Stream.tick("1 seconds").pipe(Stream.map(() => new Date())), {
  initialValue: new Date(),
}).pipe(Atom.keepAlive)

export const useAnonymousAtomMount = <RI, RR, A, E>(
  runtime: Atom.AtomRuntime<RI, RR>,
  f: (get: Atom.FnContext) => Effect.Effect<A, E, RI | Scope.Scope | AtomRegistry.AtomRegistry | Reactivity.Reactivity>,
) => {
  const mountAtom = useMemo(() => runtime.atom(f), [])
  useAtomMount(mountAtom)
}

export const useAnonymousAtomSuspense = <RI, RR, A, E>(
  runtime: Atom.AtomRuntime<RI, RR>,
  f: (get: Atom.FnContext) => Effect.Effect<A, E, RI | Scope.Scope | AtomRegistry.AtomRegistry | Reactivity.Reactivity>,
) => {
  const mountAtom = useMemo(() => runtime.atom(f), [])
  const result = useAtomSuspense(mountAtom)
  return result
}
