import { Schema as S, Context } from "effect"

import { Amount } from "../index.ts"

export type AllowanceWindow = typeof AllowanceWindow.Type
export const AllowanceWindow = S.Literals(["Day", "Week", "Month", "Year", "Ever"])

export type Allowance = typeof Allowance.Type
export const Allowance = S.Struct({
  amount: Amount.Amount,
  window: AllowanceWindow,
})

export class AllowanceRef extends Context.Service<AllowanceRef, Allowance>()("crosshatch/AllowanceRef") {}
