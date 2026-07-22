import { SiweMessage } from "@signinwithethereum/siwe"
import { Effect, Schema as S } from "effect"
import { type PublicClient, verifyMessage, type VerifyMessageParameters } from "viem"

import { Address } from "../Address.ts"
import { CaAccountId } from "../CaAccountId.ts"
import { ChainId } from "../ChainId.ts"
import { Eip155Address } from "../Eip155/Eip155Address.ts"
import { Eip155Signer } from "../Eip155/Eip155Signer.ts"
import * as Prover from "./Prover.ts"
import { Proof } from "./Schema.ts"
import * as Verifier from "./Verifier.ts"

const reference = S.String.check(S.isPattern(/^\d+$/u)).pipe(
  S.decodeTo(S.FiniteFromString),
  S.check(S.isInt(), S.isGreaterThan(0)),
)

const eip155ChainId = S.TemplateLiteralParser(["eip155:", reference])

const supportsChainId = S.is(eip155ChainId)

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
        ...(unsigned.statement && { statement: unsigned.statement }),
        ...(unsigned.expirationTime && { expirationTime: unsigned.expirationTime }),
        ...(unsigned.notBefore && { notBefore: unsigned.notBefore }),
        ...(unsigned.requestId && { requestId: unsigned.requestId }),
        ...(unsigned.resources && { resources: [...unsigned.resources] }),
      }).prepareMessage(),
    ),
    Effect.catchTag("SchemaError", (cause) => new Verifier.VerifyError({ cause })),
  )

export const prover = {
  type: "eip191",
  scheme: "eip191",
  supportsChainId,
  sign: Effect.fnUntraced(function* (info, chainId) {
    const { address, signMessage } = yield* Eip155Signer
    const message = yield* createSigningMessage({ ...info, address, chainId, type: "eip191" }).pipe(
      Effect.mapError((cause) => new Prover.SignError({ cause })),
    )
    const signature = yield* Effect.tryPromise({
      try: async () => await signMessage({ message }),
      catch: (cause) => new Prover.SignError({ cause }),
    })
    return { address, signature }
  }),
} satisfies Prover.Prover<Eip155Signer>

const verifyWith = (check: (input: VerifyMessageParameters) => Promise<boolean>) =>
  Effect.fnUntraced(
    function* (proof: typeof Proof.Type) {
      const message = yield* createSigningMessage(proof)
      const { address, signature } = yield* S.decodeUnknownEffect(
        S.Struct({ address: Eip155Address, signature: S.TemplateLiteral([S.Literal("0x"), S.String]) }),
      )(proof)

      const valid = yield* Effect.tryPromise({
        try: () => check({ address, message, signature }),
        catch: (cause) => new Verifier.VerifyError({ cause }),
      })
      if (!valid) {
        return yield* new Verifier.VerifyError({})
      }

      const chainId = yield* S.decodeUnknownEffect(ChainId)(proof.chainId)
      const accountId = yield* S.decodeUnknownEffect(CaAccountId)(`${chainId}:${address.toLowerCase()}`)
      return { accountId, address: Address.make(address), chainId }
    },
    Effect.catchTags({
      SchemaError: (cause) => new Verifier.VerifyError({ cause }),
    }),
  )

export const verifier = {
  type: "eip191",
  scheme: "eip191",
  supportsChainId,
  verify: verifyWith(verifyMessage),
} satisfies Verifier.Verifier

export const makeClientVerifier = (
  clients: Readonly<Record<string, Pick<PublicClient, "verifyMessage">>>,
): Verifier.Verifier => ({
  type: "eip191",
  scheme: "eip191",
  supportsChainId,
  verify: Effect.fnUntraced(function* (proof: typeof Proof.Type) {
    const client = clients[proof.chainId]
    if (!client) {
      return yield* new Verifier.VerifyError({})
    }
    return yield* verifyWith(client.verifyMessage)(proof)
  }),
})
