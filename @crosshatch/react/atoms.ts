// TODO: any way to circumvent?
import type { Atom as _0, Result as _1 } from "@effect-atom/atom-react"
import { EnclaveProxyClient } from "./EnclaveProxyClient.ts"

export const challengeAtom = EnclaveProxyClient.query("challenge", void 0)

export const unlinkAtom = EnclaveProxyClient.mutation("unlink")

export const paymentAtom = EnclaveProxyClient.mutation("payment")
