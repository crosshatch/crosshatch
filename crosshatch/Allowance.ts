import { Schema as S } from "effect"

import { Micros } from "./Micros.ts"

export const AllowanceWindow = S.Literals(["Day", "Week", "Month", "Year", "Ever"])

export const Allowance = S.Struct({
  amount: Micros,
  window: AllowanceWindow,
})
