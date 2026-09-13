import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "RLUSD" as const

export interface RLUSD extends Family.Family<USD, typeof symbol> {}
export const RLUSD: RLUSD = Family.make({ unit: USD, symbol })
