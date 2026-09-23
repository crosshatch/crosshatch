import { Layer } from "effect"
import { Atom } from "effect/unstable/reactivity"

export const memoMap = Layer.makeMemoMapUnsafe()

export const runtime = Atom.context({ memoMap })
