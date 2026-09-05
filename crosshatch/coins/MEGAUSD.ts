import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class MEGAUSD extends Representation.Class({
  unit: USD,
  symbol: "MEGAUSD",
}) {}

const eip155 = Instrument.make(MEGAUSD, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "MegaUSD",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_4326 = eip155({
  reference: "4326",
  address: "0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7",
  schemeEnvelopes: [permit2],
})
