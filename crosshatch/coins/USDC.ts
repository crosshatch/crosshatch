import { Erc3009Scheme, Eip155, Permit2Scheme } from "../Eip155/index.ts"
import { Instrument, Representation } from "../index.ts"
import { USD } from "../units/index.ts"

export class USDC extends Representation.make("USDC", USD) {}

const eip155 = Instrument.make(USDC, Eip155.Eip155)

const erc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "USDC",
  version: "1",
})

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USDC",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_50 = eip155({
  reference: "50",
  address: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_137 = eip155({
  reference: "137",
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_143 = eip155({
  reference: "143",
  address: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_155 = eip155({
  reference: "155",
  address: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_8453 = eip155({
  reference: "8453",
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_42161 = eip155({
  reference: "42161",
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  schemeEnvelopes: [erc3009, permit2],
})
