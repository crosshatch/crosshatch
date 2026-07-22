import { createSignableMessage, type SignatureBytes } from "@solana/kit"
import { Effect, Option, Schema as S } from "effect"
import { Base58 } from "ox"

import { Address } from "../Address.ts"
import { CaAccountId } from "../CaAccountId.ts"
import { ChainId } from "../ChainId.ts"
import { Ed25519PublicKey } from "../Crypto/Crypto.ts"
import * as SolanaAddress from "../Solana/SolanaAddress.ts"
import { SolanaSigner } from "../Solana/SolanaSigner.ts"
import * as Prover from "./Prover.ts"
import { Proof } from "./Schema.ts"
import { buildSiwxMessage } from "./SiwxMessage.ts"
import * as Verifier from "./Verifier.ts"

const SolanaChainId = S.TemplateLiteralParser(["solana:", S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/u))])

const supportsChainId = (chainId: string) => Option.isSome(S.decodeUnknownOption(SolanaChainId)(chainId))

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
      return url && url.host === value ? undefined : "Expected an RFC 3986 authority"
    }),
  ),
  address: SolanaAddress.SolanaAddress,
  chainId: SolanaChainId,
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
    Effect.map(({ chainId: [, chainId], address, domain, ...rest }) =>
      buildSiwxMessage({
        header: `${domain} wants you to sign in with your Solana account:`,
        address,
        chainId,
        domain,
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
