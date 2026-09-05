import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class USDS extends Representation.Class({
  unit: USD,
  symbol: "USDS",
}) {}

const eip155 = Instrument.make(USDS, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USDS",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
  schemeEnvelopes: [permit2],
})
