import { SiweMessage } from "@signinwithethereum/siwe"
import { Context, Effect, Layer, Schema as S } from "effect"
import { type PublicClient, verifyMessage } from "viem"

import { Address } from "../Address.ts"
import { builder as eip155Account, eip155ChainId } from "../CaAccountId/eip155.ts"
import { ChainId } from "../ChainId.ts"
import { Eip155Address } from "../Eip155/Eip155Address.ts"
import { Eip155Signer } from "../Eip155/Eip155Signer.ts"
import { SiwxError } from "./Error.ts"
import type { AuthenticatedIdentity } from "./Identity.ts"
import { Proof } from "./Schema.ts"
import { makeScheme } from "./Scheme.ts"

const Signature = S.TemplateLiteral([S.Literal("0x"), S.String]).check(S.isPattern(/^0x[a-fA-F0-9]+$/u))

const createSigningMessage = Effect.fnUntraced(function* (
  unsigned: Omit<typeof Proof.Type, "signature" | "signatureScheme">,
) {
  const [, chainId] = yield* S.decodeUnknownEffect(eip155ChainId)(unsigned.chainId).pipe(
    Effect.mapError((cause) => new SiwxError({ cause })),
  )
  return yield* Effect.try({
    try: () =>
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
    catch: (cause) => new SiwxError({ cause }),
  })
})

export type Verify = (input: {
  readonly chainId: string
  readonly address: `0x${string}`
  readonly message: string
  readonly signature: `0x${string}`
}) => Effect.Effect<boolean, SiwxError>

export const Eip155Verify = Context.Reference<Verify>("crosshatch/Siwx/Eip155Verify", {
  defaultValue:
    () =>
    ({ address, message, signature }) =>
      Effect.tryPromise({
        try: () => verifyMessage({ address, message, signature }),
        catch: (cause) => new SiwxError({ cause }),
      }),
})

export const layerVerifierRpc = (clients: Readonly<Record<string, PublicClient>>) =>
  Layer.succeed(Eip155Verify, ({ chainId, address, message, signature }) => {
    const client = clients[chainId]
    if (client === undefined) {
      return new SiwxError({})
    }
    return Effect.tryPromise({
      try: () => client.verifyMessage({ address, message, signature }),
      catch: (cause) => new SiwxError({ cause }),
    })
  })

export const { prover, verifier } = makeScheme({
  type: "eip191",
  supportsChainId: (value) => eip155Account.supports(value),
  sign: Effect.fnUntraced(function* (info, chainId) {
    const signer = yield* Eip155Signer
    const unsigned = { ...info, address: signer.address, chainId, type: "eip191" }
    const message = yield* createSigningMessage(unsigned)
    const signature = yield* Effect.tryPromise({
      try: async () => await signer.signMessage({ message }),
      catch: (cause) => new SiwxError({ cause }),
    })
    return { address: signer.address, signature }
  }),
  verify: Effect.fnUntraced(function* (proof) {
    const message = yield* createSigningMessage(proof)
    const address = yield* S.decodeUnknownEffect(Eip155Address)(proof.address)
    const signature = yield* S.decodeUnknownEffect(Signature)(proof.signature)
    const verify = yield* Eip155Verify
    const verified = yield* verify({ chainId: proof.chainId, address, message, signature })
    if (!verified) {
      return yield* new SiwxError({})
    }
    const accountId = yield* eip155Account.accountId(proof.chainId, proof.address)
    const chainId = yield* S.decodeUnknownEffect(ChainId)(proof.chainId)
    return {
      accountId,
      address: Address.make(proof.address),
      chainId,
    } satisfies AuthenticatedIdentity
  }),
})
