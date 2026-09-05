import { Namespace } from "../../index.ts"

const pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/u

export class Solana extends Namespace.Class({
  name: "solana",
  address: { uniform: true, pattern },
  reference: { pattern },
}) {}
