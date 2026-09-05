import { Instrument, Representation } from "../index.ts"
import { Erc3009Scheme, Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class USDCE extends Representation.Class({
  unit: USD,
  symbol: "USDCE",
}) {}

const eip155 = Instrument.make(USDCE, Eip155.Eip155)

const adiErc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "USDC.e",
  version: "2",
})

const adiPermit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USDC.e",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const hppErc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "Bridged USDC",
  version: "2",
})

const hppPermit2 = Permit2Scheme.Permit2Scheme.make({
  name: "Bridged USDC",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_36900 = eip155({
  reference: "36900",
  address: "0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2",
  schemeEnvelopes: [adiErc3009, adiPermit2],
})

export const eip155_190415 = eip155({
  reference: "190415",
  address: "0x401eCb1D350407f13ba348573E5630B83638E30D",
  schemeEnvelopes: [hppErc3009, hppPermit2],
})
