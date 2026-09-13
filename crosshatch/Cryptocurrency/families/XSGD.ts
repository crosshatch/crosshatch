import { SGD } from "../../units.ts"
import { Family } from "../index.ts"

const symbol = "XSGD" as const

export interface XSGD extends Family.Family<SGD, typeof symbol> {}
export const XSGD: XSGD = Family.make({ unit: SGD, symbol })
