import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class USDe extends Representation.Class({
  unit: USD,
  symbol: "USDe",
}) {}

const eip155 = Instrument.make(USDe, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USDe",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0x4c9EDD5852cd905f086C759E8383e09b0b156bda",
  schemeEnvelopes: [permit2],
})
