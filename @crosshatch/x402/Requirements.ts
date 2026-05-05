import { ChainIdString, AccountAddress } from "@crosshatch/caip"
import { Schema as S } from "effect"

import { Scheme } from "./Scheme.ts"

export const Requirements = S.Struct({
  amount: S.String,
  asset: S.String,
  extra: S.Record(S.String, S.Unknown).pipe(S.optional),
  maxTimeoutSeconds: S.Number,
  network: ChainIdString,
  payTo: AccountAddress,
  scheme: Scheme,
})
