import { ChainId, Address, Asset } from "crosshatch"
import { Schema as S } from "effect"

import { Scheme } from "./Scheme.ts"

export const Requirements = S.Struct({
  amount: S.String,
  asset: Asset.Asset,
  extra: S.Record(S.String, S.Unknown).pipe(S.optional),
  maxTimeoutSeconds: S.Number,
  network: ChainId.ChainId,
  payTo: Address.Address,
  scheme: Scheme,
})
