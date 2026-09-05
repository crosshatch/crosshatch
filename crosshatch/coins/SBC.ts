import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class SBC extends Representation.Class({
  unit: USD,
  symbol: "SBC",
}) {}

const eip155 = Instrument.make(SBC, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "Stable Coin",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_723487 = eip155({
  reference: "723487",
  address: "0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb",
  schemeEnvelopes: [permit2],
})
