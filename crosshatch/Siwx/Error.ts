import { Data } from "effect"

export class ProofRejected extends Data.TaggedError("ProofRejected")<{
  readonly reason:
    | "unknown-nonce"
    | "challenge-mismatch"
    | "uri-mismatch"
    | "stale"
    | "expired"
    | "not-yet-valid"
    | "unsupported-chain"
    | "malformed-proof"
    | "invalid-signature"
  readonly cause?: unknown
}> {}

export class SignatureCheckError extends Data.TaggedError("SignatureCheckError")<{
  readonly cause?: unknown
}> {}

export class SignError extends Data.TaggedError("SignError")<{
  readonly cause?: unknown
}> {}
