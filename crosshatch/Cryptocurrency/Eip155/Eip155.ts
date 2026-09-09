import { Namespace } from "../index.ts"

const _tag = "eip155" as const
const uniform = true as const

export interface Eip155 extends Namespace.Namespace<typeof _tag, typeof uniform> {}
export const Eip155: Eip155 = Namespace.make({
  _tag,
  reference: {
    pattern: /^[1-9][0-9]*$/u,
  },
  address: {
    uniform,
    pattern: /^0x[a-fA-F0-9]{40}$/u,
  },
})
