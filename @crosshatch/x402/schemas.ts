import { Schema as S } from "effect"

export const ResourceInfo = S.Struct({
  url: S.String,
  description: S.String,
  mimeType: S.String,
})

export const Network = S.TemplateLiteral(S.String, S.Literal(":"), S.String)

const UnknownRecord = S.Record({
  key: S.String,
  value: S.Unknown,
})

export const PaymentRequirements = S.Struct({
  scheme: S.String,
  network: Network,
  asset: S.String,
  amount: S.String,
  payTo: S.String,
  maxTimeoutSeconds: S.Number,
  extra: UnknownRecord,
})

export const PaymentRequired = S.Struct({
  x402Version: S.Number,
  error: S.String.pipe(S.optional),
  resource: ResourceInfo,
  accepts: S.Array(PaymentRequirements),
  extensions: UnknownRecord.pipe(S.optional),
})

export const PaymentPayload = S.Struct({
  x402Version: S.Number,
  resource: ResourceInfo,
  accepted: PaymentRequirements,
  payload: UnknownRecord,
  extensions: UnknownRecord.pipe(S.optional),
})
