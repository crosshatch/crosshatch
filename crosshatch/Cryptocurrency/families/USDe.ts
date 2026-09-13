import { USD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "USDe" as const

export interface USDe extends Family.Family<USD, typeof symbol> {}
export const USDe: USDe = Family.make({ unit: USD, symbol })
