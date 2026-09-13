import { Instrument, Representation } from "../index.ts"
import { Eip155, Permit2Scheme } from "../namespaces/Eip155/index.ts"
import { SGD } from "../units/index.ts"

export class XSGD extends Representation.Class({
  unit: SGD,
  symbol: "XSGD",
}) {}

const eip155 = Instrument.make(XSGD, Eip155.Eip155)

const permit2 = Permit2Scheme.Permit2Scheme.make({
  name: "XSGD",
  version: "1",
  assetTransferMethod: "permit2",
})

export const eip155_1 = eip155({
  reference: "1",
  address: "0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96",
  schemeEnvelopes: [permit2],
})

export const eip155_137 = eip155({
  reference: "137",
  address: "0xDC3326e71D45186F113a2F448984CA0e8D201995",
  schemeEnvelopes: [permit2],
})

export const eip155_8453 = eip155({
  reference: "8453",
  address: "0x0A4C9cb2778aB3302996A34BeFCF9a8Bc288C33b",
  schemeEnvelopes: [permit2],
})

export const eip155_42161 = eip155({
  reference: "42161",
  address: "0xE333e7754a2DC1E020a162Ecab019254b9DaB653",
  schemeEnvelopes: [permit2],
})

export const eip155_43114 = eip155({
  reference: "43114",
  address: "0xb2F85b7AB3c2b6f62DF06dE6aE7D09c010a5096E",
  schemeEnvelopes: [permit2],
})
