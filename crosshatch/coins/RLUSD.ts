import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class RLUSD extends Representation.Class({
  unit: USD,
  symbol: "RLUSD",
}) {}

const eip155 = Instrument.make(RLUSD, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "RLUSD",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD",
  schemeEnvelopes: [permit2],
})
