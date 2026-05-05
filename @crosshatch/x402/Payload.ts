import { Schema as S } from "effect"

import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

const Erc3009Payload = S.Struct({
  signature: S.String,
  authorization: S.Struct({
    from: S.String,
    to: S.String,
    value: S.String,
    validAfter: S.String,
    validBefore: S.String,
    nonce: S.String,
  }),
})

const Permit2Payload = S.Struct({
  signature: S.String,
  permit2Authorization: S.Struct({
    from: S.String,
    permitted: S.Struct({ token: S.String, amount: S.String }),
    spender: S.String,
    nonce: S.String,
    deadline: S.String,
    witness: S.Struct({
      to: S.String,
      validAfter: S.String,
      extra: S.String.pipe(S.optional),
    }),
  }),
})

const SolanaPayload = S.Struct({
  transaction: S.String,
})

export const PaymentPayload = S.Union([Erc3009Payload, Permit2Payload, SolanaPayload])

export const Payload = S.Struct({
  accepted: Requirements,
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
  payload: PaymentPayload,
  resource: ResourceInfo.pipe(S.optional),
  x402Version: Version,
})
