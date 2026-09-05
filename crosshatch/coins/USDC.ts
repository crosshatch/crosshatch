import { Instrument, Representation } from "../index.ts"
import { Erc3009Scheme, Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class USDC extends Representation.Class({
  unit: USD,
  symbol: "USDC",
}) {}

const eip155 = Instrument.make(USDC, Eip155.Eip155)

const erc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "USD Coin",
  version: "2",
})

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USD Coin",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const xdcErc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "USDC",
  version: "2",
})

const xdcPermit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USDC",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const igraPermit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USDC",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_10 = eip155({
  reference: "10",
  address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_25 = eip155({
  reference: "25",
  address: "0x3D7F2C478aAfdB65542BCB44bCeeC05849999d2D",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_50 = eip155({
  reference: "50",
  address: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
  schemeEnvelopes: [xdcErc3009, xdcPermit2],
})

export const eip155_130 = eip155({
  reference: "130",
  address: "0x078D782b760474a361dDA0AF3839290b0EF57AD6",
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

export const eip155_146 = eip155({
  reference: "146",
  address: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_196 = eip155({
  reference: "196",
  address: "0xB6CEceAB302E2E4948951eE7843FC24E92933061",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_324 = eip155({
  reference: "324",
  address: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_480 = eip155({
  reference: "480",
  address: "0x79A02482A880bCe3F13E09da970dC34dB4cD24D1",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_999 = eip155({
  reference: "999",
  address: "0xb88339CB7199b77E23DB6E890353E22632Ba630f",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_1672 = eip155({
  reference: "1672",
  address: "0xC879C018dB60520F4355C26eD1a6D572cdAC1815",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_1776 = eip155({
  reference: "1776",
  address: "0xa00C59fF5a080D2b954d0c75e46E22a0c371235a",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_2818 = eip155({
  reference: "2818",
  address: "0xCfb1186F4e93D60E60a8bDd997427D1F33bc372B",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_3343 = eip155({
  reference: "3343",
  address: "0x98d2919b9A214E6Fa5384AC81E6864bA686Ad74c",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_8453 = eip155({
  reference: "8453",
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_9745 = eip155({
  reference: "9745",
  address: "0x2d661C89D812261039AF9764eceaAee884f5F67F",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_38833 = eip155({
  reference: "38833",
  address: "0xA5b8BF902b2844dA17d4506cc827F7F1681735E7",
  schemeEnvelopes: [igraPermit2],
})

export const eip155_42161 = eip155({
  reference: "42161",
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_42220 = eip155({
  reference: "42220",
  address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_43114 = eip155({
  reference: "43114",
  address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_57073 = eip155({
  reference: "57073",
  address: "0x2D270e6886d130D724215A266106e6832161EAEd",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_59144 = eip155({
  reference: "59144",
  address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_81224 = eip155({
  reference: "81224",
  address: "0xd996633a415985DBd7D6D12f4A4343E31f5037cf",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_98866 = eip155({
  reference: "98866",
  address: "0x222365EF19F7947e5484218551B56bb3965Aa7aF",
  schemeEnvelopes: [erc3009, permit2],
})
