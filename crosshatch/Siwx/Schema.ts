import { Effect, Schema as S } from "effect"

export const SignatureType = S.String

export const SignatureScheme = S.String

export const SupportedChain = S.Struct({
  chainId: S.String,
  type: SignatureType,
  signatureScheme: SignatureScheme.pipe(S.optional),
})

export const Info = S.Struct({
  domain: S.String,
  uri: S.String,
  statement: S.String.pipe(S.optional),
  version: S.Literal("1"),
  nonce: S.String,
  issuedAt: S.String,
  expirationTime: S.String.pipe(S.optional),
  notBefore: S.String.pipe(S.optional),
  requestId: S.String.pipe(S.optional),
  resources: S.Array(S.String).pipe(S.optional),
})

export const Challenge = S.Struct({
  info: Info,
  supportedChains: S.Array(SupportedChain),
  schema: S.Record(S.String, S.Json).pipe(S.withDecodingDefault(Effect.succeed({}))),
})

export const Proof = S.Struct({
  ...Info.fields,
  address: S.String,
  chainId: S.String,
  type: SignatureType,
  signatureScheme: SignatureScheme.pipe(S.optional),
  signature: S.String,
})

export const SIGN_IN_WITH_X = "sign-in-with-x" as const

export const CHALLENGE_MAX_AGE_MS = 300_000

export const ProofFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Proof))))

export const ChallengeFromJson = S.toCodecJson(Challenge)

export const proofSchema = S.decodeUnknownSync(S.Record(S.String, S.Json))(S.toJsonSchemaDocument(Proof).schema)
