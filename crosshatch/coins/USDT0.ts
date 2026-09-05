import { Instrument, Representation } from "../index.ts"
import { Erc3009Scheme, Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { USD } from "../units/index.ts"

export class USDT0 extends Representation.Class({
  unit: USD,
  symbol: "USDT0",
}) {}

const eip155 = Instrument.make(USDT0, Eip155.Eip155)

const erc3009 = Erc3009Scheme.Erc3009Scheme.make({
  name: "USDT0",
  version: "1",
})

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "USDT0",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_10 = eip155({
  reference: "10",
  address: "0x01bFF41798a0BcF287b996046Ca68b395DbC1071",
  schemeEnvelopes: [permit2],
})

export const eip155_14 = eip155({
  reference: "14",
  address: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
  schemeEnvelopes: [permit2],
})

export const eip155_30 = eip155({
  reference: "30",
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  schemeEnvelopes: [permit2],
})

export const eip155_130 = eip155({
  reference: "130",
  address: "0x9151434b16b9763660705744891fA906F660EcC5",
  schemeEnvelopes: [permit2],
})

export const eip155_137 = eip155({
  reference: "137",
  address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  schemeEnvelopes: [permit2],
})

export const eip155_143 = eip155({
  reference: "143",
  address: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
  schemeEnvelopes: [permit2],
})

export const eip155_196 = eip155({
  reference: "196",
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  schemeEnvelopes: [permit2],
})

export const eip155_988 = eip155({
  reference: "988",
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  schemeEnvelopes: [erc3009, permit2],
})

export const eip155_999 = eip155({
  reference: "999",
  address: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
  schemeEnvelopes: [permit2],
})

export const eip155_1030 = eip155({
  reference: "1030",
  address: "0xaf37E8B6C9ED7f6318979f56Fc287d76c30847ff",
  schemeEnvelopes: [permit2],
})

export const eip155_1329 = eip155({
  reference: "1329",
  address: "0x9151434b16b9763660705744891fA906F660EcC5",
  schemeEnvelopes: [permit2],
})

export const eip155_2818 = eip155({
  reference: "2818",
  address: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
  schemeEnvelopes: [permit2],
})

export const eip155_4217 = eip155({
  reference: "4217",
  address: "0x20C00000000000000000000014f22CA97301EB73",
  schemeEnvelopes: [permit2],
})

export const eip155_4326 = eip155({
  reference: "4326",
  address: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
  schemeEnvelopes: [permit2],
})

export const eip155_5000 = eip155({
  reference: "5000",
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  schemeEnvelopes: [permit2],
})

export const eip155_9745 = eip155({
  reference: "9745",
  address: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
  schemeEnvelopes: [permit2],
})

export const eip155_42161 = eip155({
  reference: "42161",
  address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  schemeEnvelopes: [permit2],
})

export const eip155_57073 = eip155({
  reference: "57073",
  address: "0x0200C29006150606B650577BBE7B6248F58470c1",
  schemeEnvelopes: [permit2],
})

export const eip155_80094 = eip155({
  reference: "80094",
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  schemeEnvelopes: [permit2],
})
