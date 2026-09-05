import { Instrument, Representation } from "../index.ts"
import { Eip155 } from "../namespaces/Eip155/index.ts"
import { JPY } from "../units/index.ts"

export class JPYC extends Representation.Class({
  unit: JPY,
  symbol: "JPYC",
}) {}

const eip155 = Instrument.make(JPYC, Eip155.Eip155)

export const eip155_50 = eip155({
  reference: "50",
  address: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
  schemeEnvelopes: [],
})
