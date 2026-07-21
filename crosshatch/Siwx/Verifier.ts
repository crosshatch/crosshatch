import { Data, type Effect } from "effect"

import type { AuthenticatedIdentity } from "./Identity.ts"
import type { Proof } from "./Schema.ts"

export class VerifyError extends Data.TaggedError("VerifyError")<{
  readonly cause?: unknown
}> {}

export interface Verifier {
  readonly type: string
  readonly scheme: string
  readonly supportsChainId: (chainId: string) => boolean
  readonly verify: (proof: typeof Proof.Type) => Effect.Effect<AuthenticatedIdentity, VerifyError, unknown>
}
