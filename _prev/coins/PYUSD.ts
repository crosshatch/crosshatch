import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class PYUSD extends Representation.Class({
  unit: USD,
  symbol: "PYUSD",
}) {}

const eip155 = Instrument.make(PYUSD, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "PayPal USD",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
  schemeEnvelopes: [permit2],
})

export const eip155_137 = eip155({
  reference: "137",
  address: "0x99aF3EeA856556646C98c8B9b2548Fe815240750",
  schemeEnvelopes: [permit2],
})

export const eip155_196 = eip155({
  reference: "196",
  address: "0x87b4a8176B3Df6b71e26CC095edcAf4Db07506B4",
  schemeEnvelopes: [permit2],
})

export const eip155_42161 = eip155({
  reference: "42161",
  address: "0x46850aD61C2B7d64d08c9C754F45254596696984",
  schemeEnvelopes: [permit2],
})
