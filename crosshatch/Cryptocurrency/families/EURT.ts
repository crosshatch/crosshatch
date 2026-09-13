import { EUR } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "EURT" as const

export interface EURT extends Family.Family<EUR, typeof symbol> {}
export const EURT: EURT = Family.make({ unit: EUR, symbol })
