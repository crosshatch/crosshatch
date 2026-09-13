import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "PYUSD" as const

export interface PYUSD extends Family.Family<USD, typeof symbol> {}
export const PYUSD: PYUSD = Family.make({ unit: USD, symbol })
