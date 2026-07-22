import { Effect, Schema as S } from "effect"

import { Base64JsonString, JsonRecord } from "../_util.ts"

export const SupportedChain = S.Struct({
  chainId: S.String,
  type: S.String,
  signatureScheme: S.String.pipe(S.optional),
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
  schema: JsonRecord.pipe(S.withDecodingDefault(Effect.succeed({}))),
})

export const Proof = S.Struct({
  ...Info.fields,
  address: S.String,
  chainId: S.String,
  type: S.String,
  signatureScheme: S.String.pipe(S.optional),
  signature: S.String,
})

export type UnsignedProof = Omit<typeof Proof.Type, "signature" | "signatureScheme">

export const SIGN_IN_WITH_X = "sign-in-with-x" as const

export const CHALLENGE_MAX_AGE_MS = 300_000

export const ProofFromBase64JsonString = Base64JsonString(Proof)
