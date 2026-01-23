// TODO: any way to circumvent?
import type { Atom as _0, Result as _1 } from "@effect-atom/atom-react"
import { BridgeClient } from "./BridgeClient.ts"

export const challengeAtom = BridgeClient.query("challenge", void 0)

export const unlinkAtom = BridgeClient.mutation("unlink")

export const paymentAtom = BridgeClient.mutation("payment")
