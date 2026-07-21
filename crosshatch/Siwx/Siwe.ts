import { SiweMessage } from "@signinwithethereum/siwe"
import { Effect, Option, Schema as S } from "effect"
import { type PublicClient } from "viem"

import { Address } from "../Address.ts"
import { CaAccountId } from "../CaAccountId.ts"
import { ChainId } from "../ChainId.ts"
import { Eip155Address } from "../Eip155/Eip155Address.ts"
import { Eip155Signer } from "../Eip155/Eip155Signer.ts"
import { ProofRejected, SignError } from "./Error.ts"
import * as Prover from "./Prover.ts"
import { Proof } from "./Schema.ts"
import type * as Verifier from "./Verifier.ts"

const reference = S.String.check(S.isPattern(/^\d+$/u)).pipe(
  S.decodeTo(S.FiniteFromString),
  S.check(S.isInt(), S.isGreaterThan(0)),
)

const eip155ChainId = S.TemplateLiteralParser(["eip155:", reference])

const supportsChainId = (chainId: string) => Option.isSome(S.decodeUnknownOption(eip155ChainId)(chainId))

const createSigningMessage = (unsigned: Omit<typeof Proof.Type, "signature" | "signatureScheme">) =>
  S.decodeUnknownEffect(eip155ChainId)(unsigned.chainId).pipe(
    Effect.map(([, chainId]) =>
      new SiweMessage({
        address: unsigned.address,
        chainId,
        domain: unsigned.domain,
        nonce: unsigned.nonce,
        uri: unsigned.uri,
        version: "1",
        issuedAt: unsigned.issuedAt,
        ...(unsigned.statement !== undefined && { statement: unsigned.statement }),
        ...(unsigned.expirationTime !== undefined && { expirationTime: unsigned.expirationTime }),
        ...(unsigned.notBefore !== undefined && { notBefore: unsigned.notBefore }),
        ...(unsigned.requestId !== undefined && { requestId: unsigned.requestId }),
        ...(unsigned.resources !== undefined && { resources: [...unsigned.resources] }),
      }).prepareMessage(),
    ),
    Effect.catchTag("SchemaError", (cause) => new ProofRejected({ cause, reason: "malformed-proof" })),
  )

export const prover = {
  type: "eip191",
  scheme: "eip191",
  supportsChainId,
  sign: Effect.fnUntraced(function* (info, chainId) {
    const signer = yield* Eip155Signer
    const message = yield* createSigningMessage({ ...info, address: signer.address, chainId, type: "eip191" })
    const signature = yield* Effect.tryPromise({
      try: async () => await signer.signMessage({ message }),
      catch: (cause) => new SignError({ cause }),
    })
    return { address: signer.address, signature }
  }),
} satisfies Prover.Prover<Eip155Signer>

export const makeVerifier = (
  clients: Readonly<Record<string, Pick<PublicClient, "verifyMessage">>>,
): Verifier.Verifier => ({
  type: "eip191",
  scheme: "eip191",
  supportsChainId,
  verify: Effect.fnUntraced(
    function* (proof: typeof Proof.Type) {
      const client = clients[proof.chainId]
      if (client === undefined) {
        return yield* new ProofRejected({ reason: "unsupported-chain" })
      }

      const message = yield* createSigningMessage(proof)
      const { address, signature } = yield* S.decodeUnknownEffect(
        S.Struct({ address: Eip155Address, signature: S.TemplateLiteral([S.Literal("0x"), S.String]) }),
      )(proof)

      const valid = yield* Effect.tryPromise({
        try: () => client.verifyMessage({ address, message, signature }),
        catch: (cause) => new ProofRejected({ reason: "invalid-signature", cause }),
      })
      if (!valid) {
        return yield* new ProofRejected({ reason: "invalid-signature" })
      }

      const chainId = yield* S.decodeUnknownEffect(ChainId)(proof.chainId)
      const accountId = yield* S.decodeUnknownEffect(CaAccountId)(`${chainId}:${address.toLowerCase()}`)
      return { accountId, address: Address.make(address), chainId }
    },
    Effect.catchTags({
      SchemaError: (cause) => new ProofRejected({ reason: "malformed-proof", cause }),
    }),
  ),
})
