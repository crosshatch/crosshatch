import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class DAI extends Representation.Class({
  unit: USD,
  symbol: "DAI",
}) {}

const eip155 = Instrument.make(DAI, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "Dai Stablecoin",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  schemeEnvelopes: [permit2],
})

export const eip155_10 = eip155({
  reference: "10",
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  schemeEnvelopes: [permit2],
})

export const eip155_137 = eip155({
  reference: "137",
  address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  schemeEnvelopes: [permit2],
})

export const eip155_8453 = eip155({
  reference: "8453",
  address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  schemeEnvelopes: [permit2],
})

export const eip155_42161 = eip155({
  reference: "42161",
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  schemeEnvelopes: [permit2],
})

export const eip155_43114 = eip155({
  reference: "43114",
  address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  schemeEnvelopes: [permit2],
})
