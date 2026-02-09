import { Schema as S } from "effect"

export const ResourceInfo = S.Struct({
  url: S.String.pipe(S.optional),
  description: S.String.pipe(S.optional),
  mimeType: S.String.pipe(S.optional),
})

export const Network = S.TemplateLiteral(S.String, S.Literal(":"), S.String)

const UnknownRecord = S.Record({
  key: S.String,
  value: S.Unknown,
})

export const PaymentRequirements = S.Struct({
  scheme: S.Literal("exact"),
  network: Network,
  asset: S.String,
  amount: S.String,
  payTo: S.String,
  maxTimeoutSeconds: S.Number,
  extra: UnknownRecord,
})

export const Version = S.Literal(1, 2)

export const Accepts = S.Tuple([PaymentRequirements], PaymentRequirements)

export const PaymentRequired = S.Struct({
  x402Version: Version,
  error: S.String.pipe(S.optional),
  resource: ResourceInfo.pipe(S.optional),
  accepts: Accepts,
  extensions: UnknownRecord.pipe(S.optional),
})

export const PaymentPayload = S.Struct({
  x402Version: S.Number,
  resource: ResourceInfo,
  accepted: PaymentRequirements,
  payload: UnknownRecord,
  extensions: UnknownRecord.pipe(S.optional),
})
