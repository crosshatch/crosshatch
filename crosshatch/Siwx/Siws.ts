import { createSignableMessage } from "@solana/kit"
import { Effect, Option, Schema as S } from "effect"
import { Base58 } from "ox"

import { Address } from "../Address.ts"
import { CaAccountId } from "../CaAccountId.ts"
import { ChainId } from "../ChainId.ts"
import { Ed25519PublicKey } from "../Crypto/Crypto.ts"
import { Reference } from "../Reference.ts"
import * as SolanaAddress from "../Solana/SolanaAddress.ts"
import { SolanaSigner } from "../Solana/SolanaSigner.ts"
import { ProofRejected, SignError } from "./Error.ts"
import * as Prover from "./Prover.ts"
import { Proof } from "./Schema.ts"
import * as Verifier from "./Verifier.ts"

const solanaChainId = S.TemplateLiteralParser(["solana:", S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/u))])

const supportsChainId = (chainId: string) => Option.isSome(S.decodeUnknownOption(solanaChainId)(chainId))

const accountId = Effect.fnUntraced(function* (chainId: string, address: string) {
  const [, reference] = yield* S.decodeUnknownEffect(solanaChainId)(chainId)
  const validatedAddress = yield* S.decodeUnknownEffect(SolanaAddress.SolanaAddress)(address)
  const validatedReference = yield* S.decodeUnknownEffect(Reference)(reference)
  return CaAccountId.make(`solana:${validatedReference}:${validatedAddress}`)
})

const Rfc3339 = S.String.check(
  S.isPattern(/^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})$/u),
  S.makeFilter((value) =>
    Option.isSome(S.decodeUnknownOption(S.DateTimeUtcFromString)(value)) ? undefined : "Expected an RFC 3339 date-time",
  ),
)
const Pchar = /^(?:[a-zA-Z0-9._~!$&'()*+,;=:@-]|%[a-fA-F0-9]{2})*$/u

const Uri = S.String.check(
  S.makeFilter((value) =>
    Option.isSome(S.decodeUnknownOption(S.URLFromString)(value)) ? undefined : "Expected an RFC 3986 URI",
  ),
)

const Message = S.Struct({
  domain: S.String.check(
    S.makeFilter((value) => {
      const url = URL.parse(`https://${value}`)
      return url !== null && url.host === value ? undefined : "Expected an RFC 3986 authority"
    }),
  ),
  address: SolanaAddress.SolanaAddress,
  chainId: solanaChainId,
  uri: Uri,
  version: S.Literal("1"),
  statement: S.String.check(S.isPattern(/^[^\r\n]+$/u)).pipe(S.optional),
  nonce: S.String.check(S.isPattern(/^[a-zA-Z0-9]{8,}$/u)),
  issuedAt: Rfc3339,
  expirationTime: Rfc3339.pipe(S.optional),
  notBefore: Rfc3339.pipe(S.optional),
  requestId: S.String.check(S.isPattern(Pchar)).pipe(S.optional),
  resources: S.Array(Uri).pipe(S.optional),
})

const createSigningMessage = (input: Omit<typeof Proof.Type, "signature" | "signatureScheme">) =>
  S.decodeUnknownEffect(Message)(input).pipe(
    Effect.map(({ chainId: [, reference], ...unsigned }) => {
      const lines = [`${unsigned.domain} wants you to sign in with your Solana account:`, unsigned.address]
      if (unsigned.statement !== undefined) {
        lines.push("", unsigned.statement)
      }
      lines.push(
        "",
        `URI: ${unsigned.uri}`,
        `Version: ${unsigned.version}`,
        `Chain ID: ${reference}`,
        `Nonce: ${unsigned.nonce}`,
        `Issued At: ${unsigned.issuedAt}`,
      )
      if (unsigned.expirationTime !== undefined) {
        lines.push(`Expiration Time: ${unsigned.expirationTime}`)
      }
      if (unsigned.notBefore !== undefined) {
        lines.push(`Not Before: ${unsigned.notBefore}`)
      }
      if (unsigned.requestId !== undefined) {
        lines.push(`Request ID: ${unsigned.requestId}`)
      }
      if (unsigned.resources !== undefined) {
        lines.push("Resources:", ...unsigned.resources.map((resource) => `- ${resource}`))
      }
      return lines.join("\n")
    }),
    Effect.catchTag("SchemaError", (cause) => new ProofRejected({ cause, reason: "malformed-proof" })),
  )

export const prover = {
  type: "ed25519",
  scheme: "siws",
  supportsChainId,
  sign: Effect.fnUntraced(function* (info, chainId) {
    const signer = yield* SolanaSigner
    const address = SolanaAddress.SolanaAddress.make(signer.address)
    const message = yield* createSigningMessage({ ...info, address, chainId, type: "ed25519" })
    const [signatures] = yield* Effect.tryPromise({
      try: () => signer.signMessages([createSignableMessage(new TextEncoder().encode(message))]),
      catch: (cause) => new SignError({ cause }),
    })
    const signature = signatures?.[signer.address]
    if (signature === undefined || signature.byteLength !== 64) {
      return yield* Effect.die("siws: signer did not return a 64-byte signature")
    }
    return { address, signature: Base58.fromBytes(signature) }
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
        return yield* new ProofRejected({ reason: "invalid-signature" })
      }

      const chainId = yield* S.decodeUnknownEffect(ChainId)(proof.chainId)

      return {
        accountId: yield* accountId(proof.chainId, proof.address),
        address: Address.make(proof.address),
        chainId,
      }
    },
    Effect.catchTags({
      SchemaError: (cause) => new ProofRejected({ reason: "malformed-proof", cause }),
    }),
  ),
} satisfies Verifier.Verifier
