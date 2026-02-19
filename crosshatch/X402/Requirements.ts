import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"

import { Address } from "./Address.ts"
import { Network } from "./Network.ts"
import { Scheme } from "./Scheme.ts"

export const Requirements = S.Struct({
  amount: S.String,
  asset: S.String,
  extra: UnknownRecord,
  maxTimeoutSeconds: S.Number,
  network: Network,
  payTo: Address,
  scheme: Scheme,
})

export const make = ({
  recipient,
  amount,
  timeout,
}: {
  recipient: typeof Address.Type
  amount: string
  timeout?: number | undefined
}): typeof Requirements.Type => ({
  amount,
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  extra: {
    name: "USDC",
    version: "2",
  },
  maxTimeoutSeconds: timeout ?? 60,
  network: `eip155:8453`,
  payTo: recipient,
  scheme: "exact",
})
