import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "MUSD" as const

export interface MUSD extends Family.Family<USD, typeof symbol> {}
export const MUSD: MUSD = Family.make({ unit: USD, symbol })
