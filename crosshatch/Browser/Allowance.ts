import { Schema as S, Context } from "effect"

import { Amount } from "../index.ts"

export type AllowanceWindow = typeof AllowanceWindow.Type
export const AllowanceWindow = S.Literals(["Day", "Week", "Month", "Year", "Ever"])

type Allowance_ = typeof Allowance_.Type
const Allowance_ = S.Struct({
  amount: Amount.Amount,
  window: AllowanceWindow,
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface Allowance extends Allowance_ {}

export const Allowance = Object.assign(
  Context.Service<Allowance, Allowance>()("crosshatch/Browser/Allowance"),
  Allowance_,
)
