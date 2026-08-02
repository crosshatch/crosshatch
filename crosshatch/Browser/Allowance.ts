import { Schema as S, Context } from "effect"

import { Amount } from "../index.ts"

export type AllowanceWindow = typeof AllowanceWindow.Type
export const AllowanceWindow = S.Literals(["Day", "Week", "Month", "Year", "Ever"])

export interface Allowance {
  readonly amount: Amount.Amount
  readonly window: AllowanceWindow
}

export const Allowance = Object.assign(
  Context.Service<Allowance, Allowance>()("crosshatch/Browser/AllowanceRef"),
  S.Struct({
    amount: Amount.Amount,
    window: AllowanceWindow,
  }),
)
