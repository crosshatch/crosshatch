import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "USDT0" as const

export interface USDT0 extends Family.Family<USD, typeof symbol> {}
export const USDT0: USDT0 = Family.make({ unit: USD, symbol })
