import { JPY } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "JPYC" as const

export interface JPYC extends Family.Family<JPY, typeof symbol> {}
export const JPYC: JPYC = Family.make({ unit: JPY, symbol })
