import { Effect, Layer } from "effect"
import { Atom } from "effect/unstable/reactivity"

export const memoMap = Layer.makeMemoMap.pipe(Effect.runSync)

export const runtime = Atom.context({ memoMap })
