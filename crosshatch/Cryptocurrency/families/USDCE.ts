import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "USDCE" as const

export interface USDCE extends Family.Family<USD, typeof symbol> {}
export const USDCE: USDCE = Family.make({ unit: USD, symbol })
