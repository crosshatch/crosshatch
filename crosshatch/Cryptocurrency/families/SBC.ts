import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "SBC" as const

export interface SBC extends Family.Family<USD, typeof symbol> {}
export const SBC: SBC = Family.make({ unit: USD, symbol })
