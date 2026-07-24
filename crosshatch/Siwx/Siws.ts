import { createSignableMessage, type SignatureBytes } from "@solana/kit"
import { Effect, Option, pipe, Schema as S } from "effect"
import { Base58 } from "ox"

import { Address } from "../Address.ts"
import { CaAccountId } from "../CaAccountId.ts"
import { ChainId } from "../ChainId.ts"
import { Ed25519PublicKey } from "../Crypto/Crypto.ts"
import * as SolanaAddress from "../Solana/SolanaAddress.ts"
import { SolanaSigner } from "../Solana/SolanaSigner.ts"
import * as Prover from "./Prover.ts"
import { Proof, type UnsignedProof } from "./Schema.ts"
import * as SiwxMessage from "./SiwxMessage.ts"
import * as Verifier from "./Verifier.ts"

const SolanaChainId = S.TemplateLiteralParser(["solana:", S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/u))])

const supportsChainId = (chainId: string) => Option.isSome(S.decodeUnknownOption(SolanaChainId)(chainId))

const createSigningMessage = (input: UnsignedProof) =>
  pipe(
    input,
    S.decodeUnknownEffect(
      S.Struct({ ...SiwxMessage.messageFields, address: SolanaAddress.SolanaAddress, chainId: SolanaChainId }),
    ),
    Effect.map(({ chainId: [, chainId], address, domain, ...rest }) =>
      SiwxMessage.buildSiwxMessage({
        header: `${domain} wants you to sign in with your Solana account:`,
        address,
        chainId,
        ...rest,
      }),
    ),
    Effect.catchTag("SchemaError", (cause) => new Verifier.VerifyError({ cause })),
  )

export const prover = {
  type: "ed25519",
  scheme: "siws",
  supportsChainId,
  sign: Effect.fnUntraced(function* (info, chainId) {
    const signer = yield* SolanaSigner
    const address = SolanaAddress.SolanaAddress.make(signer.address)
    const signature = yield* createSigningMessage({ ...info, address, chainId, type: "ed25519" }).pipe(
      Effect.flatMap((message) =>
        Effect.tryPromise(() => signer.signMessages([createSignableMessage(new TextEncoder().encode(message))])),
      ),
      Effect.map(([signatures]) => signatures?.[signer.address]),
      Effect.filterOrFail(
        (signature): signature is SignatureBytes => signature !== undefined && signature.byteLength === 64,
      ),
      Effect.map(Base58.fromBytes),
      Effect.mapError((cause) => new Prover.SignError({ cause })),
    )
    return { address, signature }
  }),
} satisfies Prover.Prover<SolanaSigner>

export const verifier = {
  type: "ed25519",
  scheme: "siws",
  supportsChainId,
  verify: Effect.fnUntraced(
    function* (proof: typeof Proof.Type) {
      const message = yield* createSigningMessage(proof)
      const signature = yield* S.decodeUnknownEffect(
        S.String.check(
          S.isPattern(/^[1-9A-HJ-NP-Za-km-z]+$/u),
          S.makeFilter((value) =>
            Base58.toBytes(value).byteLength === 64 ? undefined : "Expected a 64-byte Base58 Ed25519 signature",
          ),
        ),
      )(proof.signature)

      const verified = yield* Ed25519PublicKey.fromBytes(Base58.toBytes(proof.address)).pipe(
        Effect.flatMap((publicKey) =>
          Ed25519PublicKey.verify(publicKey, Base58.toBytes(signature), new TextEncoder().encode(message)),
        ),
      )
      if (!verified) {
        return yield* new Verifier.VerifyError({})
      }

      const chainId = yield* S.decodeUnknownEffect(ChainId)(proof.chainId)
      const accountId = yield* S.decodeUnknownEffect(CaAccountId)(`${chainId}:${proof.address}`)
      return { accountId, address: Address.make(proof.address), chainId }
    },
    Effect.catchTags({
      SchemaError: (cause) => new Verifier.VerifyError({ cause }),
    }),
  ),
} satisfies Verifier.Verifier
