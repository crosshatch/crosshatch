import { Atom } from "@effect-atom/atom"
import { Effect, Layer } from "effect"

export const memoMap = Layer.makeMemoMap.pipe(Effect.runSync)

export const runtime = Atom.context({ memoMap })
