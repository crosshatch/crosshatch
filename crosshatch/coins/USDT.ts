import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class USDT extends Representation.Class({
  unit: USD,
  symbol: "USDT",
}) {}

const eip155 = Instrument.make(USDT, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "Tether USD",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  schemeEnvelopes: [permit2],
})

export const eip155_42220 = eip155({
  reference: "42220",
  address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  schemeEnvelopes: [permit2],
})

export const eip155_43114 = eip155({
  reference: "43114",
  address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
  schemeEnvelopes: [permit2],
})
