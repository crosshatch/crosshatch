import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "USDC" as const

export interface USDC extends Family.Family<USD, typeof symbol> {}
export const USDC: USDC = Family.make({ unit: USD, symbol })
