import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { JPY } from "../units/index.ts"

export class JPYC extends Representation.Class({
  unit: JPY,
  symbol: "JPYC",
}) {}

const eip155 = Instrument.make(JPYC, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "JPY Coin",
  version: "2",
  assetTransferMethod: "permit2",
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB",
  schemeEnvelopes: [permit2],
})

export const eip155_137 = eip155({
  reference: "137",
  address: "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB",
  schemeEnvelopes: [permit2],
})

export const eip155_43114 = eip155({
  reference: "43114",
  address: "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB",
  schemeEnvelopes: [permit2],
})
