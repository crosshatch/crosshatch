import type { Effect } from "effect"

import { ProofRejected } from "./Error.ts"
import type { AuthenticatedIdentity } from "./Identity.ts"
import type { Proof } from "./Schema.ts"

export interface Verifier {
  readonly type: string
  readonly scheme: string
  readonly supportsChainId: (chainId: string) => boolean
  readonly verify: (proof: typeof Proof.Type) => Effect.Effect<AuthenticatedIdentity, ProofRejected, unknown>
}
