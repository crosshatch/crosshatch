import { Schema as S } from "effect"

import { Amount } from "../Amount.ts"

export const AllowanceWindow = S.Literals(["Day", "Week", "Month", "Year", "Ever"])

export const Allowance = S.Struct({
  amount: Amount,
  window: AllowanceWindow,
})
