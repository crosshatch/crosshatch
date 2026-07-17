import { Schema as S } from "effect"

import * as Extension from "../Extension.ts"

export const identifier = "erc20ApprovalGasSponsoring" as const
export const version = "1" as const
export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"
export const MAX_UINT256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

export const Info = S.Struct({
  description: S.String.pipe(S.optional),
  version: S.String,
})

export const Enrichment = S.Struct({
  from: S.String,
  asset: S.String,
  spender: S.String,
  amount: S.String,
  signedTransaction: S.String,
  version: S.String,
})

export class Erc20ApprovalGasSponsoring extends Extension.Service<Erc20ApprovalGasSponsoring>()(
  "crosshatch/Erc20ApprovalGasSponsoring",
  {
    identifier,
    info: Info,
    enrichment: Enrichment,
  },
) {}
