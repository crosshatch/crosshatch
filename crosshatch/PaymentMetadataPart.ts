import { Schema as S } from "effect"

import { Micros } from "./Micros.ts"

export const RebateMetadataPart = S.TaggedStruct("Rebate", {
  description: S.String,
  claimed: Micros,
})

export const PaymentMetadataPart = S.Union([RebateMetadataPart])
