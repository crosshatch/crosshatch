import { Eip155 } from "../Eip155/index.ts"
import { Instrument, Representation, Unit } from "../index.ts"

export class JPYC extends Representation.make("JPYC", Unit.JPY) {}

const eip155 = Instrument.make(JPYC, Eip155.Eip155)

export const eip155_50 = eip155({
  reference: "50",
  address: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
  schemeEnvelopes: [],
})
