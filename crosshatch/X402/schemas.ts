import { Schema as S } from "effect"

export const ResourceInfo = S.Struct({
  description: S.String.pipe(S.optional),
  mimeType: S.String.pipe(S.optional),
  url: S.String.pipe(S.optional),
})

export const Network = S.TemplateLiteral(S.String, S.Literal(":"), S.String)

const UnknownRecord = S.Record({
  key: S.String,
  value: S.Unknown,
})

export const PaymentRequirements = S.Struct({
  amount: S.String,
  asset: S.String,
  extra: UnknownRecord,
  maxTimeoutSeconds: S.Number,
  network: Network,
  payTo: S.String,
  scheme: S.Literal("exact"),
})

export const Version = S.Literal(1, 2)

export const Accepts = S.Tuple([PaymentRequirements], PaymentRequirements)

export const PaymentRequired = S.Struct({
  accepts: Accepts,
  error: S.String.pipe(S.optional),
  extensions: UnknownRecord.pipe(S.optional),
  resource: ResourceInfo.pipe(S.optional),
  x402Version: Version,
})

export const parseRequired = ({ accepts: [{ amount, asset, network }] }: typeof PaymentRequired.Type) => ({
  amount: BigInt(amount),
  asset,
  network,
})

export const PaymentPayload = S.Struct({
  accepted: PaymentRequirements,
  extensions: UnknownRecord.pipe(S.optional),
  payload: UnknownRecord,
  resource: ResourceInfo,
  x402Version: S.Number,
})
