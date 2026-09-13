import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "MEGAUSD" as const

export interface MEGAUSD extends Family.Family<USD, typeof symbol> {}
export const MEGAUSD: MEGAUSD = Family.make({ unit: USD, symbol })
