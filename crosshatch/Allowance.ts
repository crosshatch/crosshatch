import { Schema as S } from "effect"

export const AllowanceWindow = S.Literals(["Day", "Week", "Month", "Year", "Ever"])

export const Allowance = S.Struct({
  amount: S.Number,
  window: AllowanceWindow,
})
