import { Context, Data, Effect, Layer, Option, Schema as S } from "effect"
import { Base58 } from "ox"

import { Address } from "../Address.ts"
import { builder as solanaAccount, solanaChainId } from "../CaAccountId/solana.ts"
import { ChainId } from "../ChainId.ts"
import { CryptoKey, Ed25519Pair, Ed25519PublicKey } from "../Crypto/Crypto.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { SOLANA_DERIVATION_PATH } from "../Solana/_common.ts"
import * as SolanaAddress from "../Solana/SolanaAddress.ts"
import type { AuthenticatedIdentity } from "./Identity.ts"
import { Proof } from "./Schema.ts"
import { makeScheme } from "./Scheme.ts"

export class SiwsError extends Data.TaggedError("SiwsError")<{ readonly cause?: unknown }> {}

export class SiwsInvalidSignatureError extends Data.TaggedError("SiwsInvalidSignatureError")<{}> {}

export class SolanaMessageSigner extends Context.Service<
  SolanaMessageSigner,
  {
    readonly address: string
    readonly signMessage: (message: Uint8Array) => Promise<Uint8Array>
  }
>()("crosshatch/Siwx/SolanaMessageSigner") {}

const decodeDateTime = S.decodeUnknownOption(S.DateTimeUtcFromString)

const Rfc3339 = S.String.check(
  S.isPattern(/^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})$/u),
  S.makeFilter((value) => (Option.isSome(decodeDateTime(value)) ? undefined : "Expected an RFC 3339 date-time")),
)

const decodeUrl = S.decodeUnknownOption(S.URLFromString)

const Uri = S.String.check(
  S.makeFilter((value) => (Option.isSome(decodeUrl(value)) ? undefined : "Expected an RFC 3986 URI")),
)

const Authority = S.String.check(
  S.makeFilter((value) => {
    const url = URL.parse(`https://${value}`)
    return url !== null && url.host === value && url.pathname === "/" && url.search === "" && url.hash === ""
      ? undefined
      : "Expected an RFC 3986 authority"
  }),
)

const Nonce = S.String.check(S.isPattern(/^[a-zA-Z0-9]{8,}$/u))

const Statement = S.String.check(S.isPattern(/^[^\r\n]+$/u))

const RequestId = S.String.check(S.isPattern(/^(?:[a-zA-Z0-9._~!$&'()*+,;=:@-]|%[a-fA-F0-9]{2})*$/u))

const Signature = S.String.check(
  S.makeFilter((value) =>
    /^[1-9A-HJ-NP-Za-km-z]+$/u.test(value) && Base58.toBytes(value).byteLength === 64
      ? undefined
      : "Expected a 64-byte Base58 Ed25519 signature",
  ),
)

const Unsigned = S.Struct({
  domain: Authority,
  address: SolanaAddress.SolanaAddress,
  chainId: solanaChainId,
  uri: Uri,
  version: S.Literal("1"),
  statement: Statement.pipe(S.optional),
  nonce: Nonce,
  issuedAt: Rfc3339,
  expirationTime: Rfc3339.pipe(S.optional),
  notBefore: Rfc3339.pipe(S.optional),
  requestId: RequestId.pipe(S.optional),
  resources: S.Array(Uri).pipe(S.optional),
})

const textEncoder = new TextEncoder()

const createSigningMessage = Effect.fnUntraced(
  function* (input: Omit<typeof Proof.Type, "signature" | "signatureScheme">) {
    const {
      chainId: [, reference],
      ...unsigned
    } = yield* S.decodeUnknownEffect(Unsigned)(input)
    const fields = [
      ["URI", unsigned.uri],
      ["Version", unsigned.version],
      ["Chain ID", reference],
      ["Nonce", unsigned.nonce],
      ["Issued At", unsigned.issuedAt],
      ["Expiration Time", unsigned.expirationTime],
      ["Not Before", unsigned.notBefore],
      ["Request ID", unsigned.requestId],
    ] as const
    return [
      `${unsigned.domain} wants you to sign in with your Solana account:`,
      unsigned.address,
      ...(unsigned.statement === undefined ? [] : ["", unsigned.statement]),
      "",
      ...fields.flatMap(([label, value]) => (value === undefined ? [] : [`${label}: ${value}`])),
      ...(unsigned.resources === undefined
        ? []
        : ["Resources:", ...unsigned.resources.map((resource) => `- ${resource}`)]),
    ].join("\n")
  },
  Effect.mapError((cause) => new SiwsError({ cause })),
)

export const layerMnemonic = Layer.effect(
  SolanaMessageSigner,
  Effect.gen(function* () {
    const keypair = yield* Mnemonic.Mnemonic.pipe(
      Effect.flatMap((v) => Ed25519Pair.fromMnemonic(v, SOLANA_DERIVATION_PATH)),
    )
    const address = yield* CryptoKey.toBytes(keypair.publicKey).pipe(Effect.map(Base58.fromBytes))
    return SolanaMessageSigner.of({
      address: SolanaAddress.SolanaAddress.make(address),
      signMessage: async (message) =>
        new Uint8Array(await crypto.subtle.sign({ name: "Ed25519" }, keypair.privateKey, message.slice())),
    })
  }),
)

export const { prover, verifier } = makeScheme({
  type: "ed25519",
  scheme: "siws",
  supportsChainId: (value) => solanaAccount.supports(value),
  sign: Effect.fnUntraced(function* (info, chainId) {
    const signer = yield* SolanaMessageSigner
    const message = yield* createSigningMessage({ ...info, address: signer.address, chainId, type: "ed25519" as const })
    const signature = yield* Effect.tryPromise({
      try: () => signer.signMessage(textEncoder.encode(message)),
      catch: (cause) => new SiwsError({ cause }),
    })
    if (signature.byteLength !== 64) {
      return yield* new SiwsInvalidSignatureError()
    }
    return { address: signer.address, signature: Base58.fromBytes(signature) }
  }),
  verify: Effect.fnUntraced(function* (proof) {
    const message = yield* createSigningMessage(proof)
    const signature = yield* S.decodeUnknownEffect(Signature)(proof.signature)
    const publicKey = yield* Ed25519PublicKey.fromBytes(Base58.toBytes(proof.address))
    const verified = yield* Ed25519PublicKey.verify(publicKey, Base58.toBytes(signature), textEncoder.encode(message))
    if (!verified) {
      return yield* new SiwsInvalidSignatureError()
    }
    const accountId = yield* solanaAccount.accountId(proof.chainId, proof.address)
    const chainId = yield* S.decodeUnknownEffect(ChainId)(proof.chainId)
    return {
      accountId,
      address: Address.make(proof.address),
      chainId,
    } satisfies AuthenticatedIdentity
  }),
})
