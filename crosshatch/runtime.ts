import { Atom } from "@effect-atom/atom"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { Live } from "./Live.ts"

export const runtime = Atom.runtime(Live)

export const crosshatchEnvAtom = runtime.atom(CrosshatchEnv)
