import { Effect, Option } from "effect"

import type { AuthenticatedIdentity } from "./Identity.ts"
import type { Prover } from "./Prover.ts"
import { Info, Proof } from "./Schema.ts"
import type { Verifier } from "./Verifier.ts"

type Sign<E, R> = (
  info: typeof Info.Type,
  chainId: string,
) => Effect.Effect<{ readonly address: string; readonly signature: string }, E, R>

type Verify<E, R> = (proof: typeof Proof.Type) => Effect.Effect<AuthenticatedIdentity, E, R>

export const makeScheme = <SignE, SignR, VerifyE, VerifyR>({
  type,
  scheme = type,
  supportsChainId,
  sign,
  verify,
}: {
  readonly type: string
  readonly scheme?: string
  readonly supportsChainId: (chainId: string) => boolean
  readonly sign: Sign<SignE, SignR>
  readonly verify: Verify<VerifyE, VerifyR>
}): {
  readonly prover: Prover<SignE, SignR>
  readonly verifier: Verifier<VerifyE, VerifyR>
} => {
  const prover: Prover<SignE, SignR> = (info, entry) => {
    const applicable =
      supportsChainId(entry.chainId) &&
      entry.type === type &&
      (entry.signatureScheme === undefined || entry.signatureScheme === scheme)
    if (!applicable) {
      return Option.none()
    }
    return Option.some(
      sign(info, entry.chainId).pipe(
        Effect.map(({ address, signature }) => ({
          ...info,
          address,
          chainId: entry.chainId,
          type,
          signatureScheme: scheme,
          signature,
        })),
      ),
    )
  }

  const verifier: Verifier<VerifyE, VerifyR> = { type, scheme, supportsChainId, verify }

  return { prover, verifier }
}
