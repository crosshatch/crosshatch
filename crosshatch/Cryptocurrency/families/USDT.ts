import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "USDT" as const

export interface USDT extends Family.Family<USD, typeof symbol> {}
export const USDT: USDT = Family.make({ unit: USD, symbol })
