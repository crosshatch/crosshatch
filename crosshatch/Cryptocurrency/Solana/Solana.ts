import { Namespace } from "../index.ts"

const _tag = "solana" as const
const uniform = true as const

const pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/u

export interface Solana extends Namespace.Namespace<typeof _tag, typeof uniform> {}
export const Solana: Solana = Namespace.make({
  _tag,
  reference: { pattern },
  address: { uniform, pattern },
})
