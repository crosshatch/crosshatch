import { Schema as S } from "effect"

import * as Address from "./Address.ts"
import * as Atomic from "./Atomic.ts"
import * as ChainId from "./ChainId.ts"

export type Requirements = typeof Requirements.Type
export const Requirements = S.Struct({
  amount: Atomic.Atomic,
  asset: Address.Address,
  extra: S.JsonObject.pipe(S.optional),
  maxTimeoutSeconds: S.Int.check(S.isGreaterThan(0)),
  network: ChainId.ChainId,
  payTo: Address.Address,
  scheme: S.Literals(["exact", "upto"]),
})
