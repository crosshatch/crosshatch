import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "USDS" as const

export interface USDS extends Family.Family<USD, typeof symbol> {}
export const USDS: USDS = Family.make({ unit: USD, symbol })
