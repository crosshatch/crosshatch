import { Representation } from "../index.ts"
import { USD } from "../units/index.ts"

export class MUSD extends Representation.Class({
  unit: USD,
  symbol: "MUSD",
}) {}
