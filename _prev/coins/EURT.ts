import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { EUR } from "../units/index.ts"

export class EURT extends Representation.Class({
  unit: EUR,
  symbol: "EURT",
}) {}

const eip155 = Instrument.make(EURT, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "Euro Tether",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0xC581b735A1688071A1746c968e0798D642EDE491",
  schemeEnvelopes: [permit2],
})
