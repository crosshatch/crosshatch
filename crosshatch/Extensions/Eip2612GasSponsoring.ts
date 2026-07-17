import { Schema as S } from "effect"

import * as Extension from "../Extension.ts"

export const identifier = "eip2612GasSponsoring" as const

export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"

export const Info = S.Struct({
  description: S.String.pipe(S.optional),
  version: S.String,
})

export const Enrichment = S.Struct({
  from: S.String,
  asset: S.String,
  spender: S.String,
  amount: S.String,
  nonce: S.String,
  deadline: S.String,
  signature: S.String,
  version: S.String,
})

export class Eip2612GasSponsoring extends Extension.Service<Eip2612GasSponsoring>()("crosshatch/Eip2612GasSponsoring", {
  identifier,
  info: Info,
  enrichment: Enrichment,
}) {}
