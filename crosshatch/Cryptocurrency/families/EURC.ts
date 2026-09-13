import { EUR } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "EURC" as const

export interface EURC extends Family.Family<EUR, typeof symbol> {}
export const EURC: EURC = Family.make({ unit: EUR, symbol })
