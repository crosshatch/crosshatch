import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "DAI" as const

export interface DAI extends Family.Family<USD, typeof symbol> {}
export const DAI: DAI = Family.make({ unit: USD, symbol })
