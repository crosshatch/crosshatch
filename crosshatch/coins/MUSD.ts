import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class MUSD extends Representation.Class({
  unit: USD,
  symbol: "MUSD",
}) {}

const eip155 = Instrument.make(MUSD, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "Mezo USD",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_31612 = eip155({
  reference: "31612",
  address: "0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186",
  schemeEnvelopes: [permit2],
})
