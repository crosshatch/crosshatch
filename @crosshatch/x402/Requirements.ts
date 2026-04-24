import { ChainIdString, AccountAddress } from "@crosshatch/caip"
import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"

import { Scheme } from "./Scheme.ts"

export const Requirements = S.Struct({
  amount: S.String,
  asset: S.String,
  extra: UnknownRecord.pipe(S.optional),
  maxTimeoutSeconds: S.Number,
  network: ChainIdString,
  payTo: AccountAddress,
  scheme: Scheme,
})
