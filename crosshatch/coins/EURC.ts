import { Instrument, Representation } from "../index.ts"
import { Erc3009Scheme, Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { EUR } from "../units/index.ts"

export class EURC extends Representation.Class({
  unit: EUR,
  symbol: "EURC",
}) {}

const eip155 = Instrument.make(EURC, Eip155.Eip155)

const euroCoinErc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "Euro Coin",
  version: "2",
})

const euroCoinPermit2 = Permit2Scheme.Permit2Scheme.make({
  name: "Euro Coin",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const eurcErc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "EURC",
  version: "2",
})

const eurcPermit2 = Permit2Scheme.Permit2Scheme.make({
  name: "EURC",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
  schemeEnvelopes: [euroCoinErc3009, euroCoinPermit2],
})

export const eip155_25 = eip155({
  reference: "25",
  address: "0xA6dE01a2d62C6B5f3525d768f34d276652C554c8",
  schemeEnvelopes: [eurcErc3009, eurcPermit2],
})

export const eip155_480 = eip155({
  reference: "480",
  address: "0x1C60ba0A0eD1019e8Eb035E6daF4155A5cE2380B",
  schemeEnvelopes: [eurcErc3009, eurcPermit2],
})

export const eip155_8453 = eip155({
  reference: "8453",
  address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
  schemeEnvelopes: [eurcErc3009, eurcPermit2],
})

export const eip155_9745 = eip155({
  reference: "9745",
  address: "0x3EE196E78d4d4248b849B8E1C7F44C5457FAFD2C",
  schemeEnvelopes: [eurcErc3009, eurcPermit2],
})

export const eip155_43114 = eip155({
  reference: "43114",
  address: "0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD",
  schemeEnvelopes: [euroCoinErc3009, euroCoinPermit2],
})
