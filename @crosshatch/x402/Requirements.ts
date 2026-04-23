import { ChainIdString, AccountAddress } from "@crosshatch/caip"
import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"

import { Scheme } from "./Scheme.ts"

export const Requirements = S.Struct({
  amount: S.String,
  asset: S.String,
  extra: UnknownRecord.pipe(S.optional),
  maxTimeoutSeconds: S.Number,
  network: ChainIdString,
  payTo: AccountAddress,
  scheme: Scheme,
})

export const make = ({
  recipient,
  amount,
  timeout,
  extra,
}: {
  recipient: typeof AccountAddress.Type
  amount: string
  timeout?: number | undefined
  extra?: typeof UnknownRecord.Type
}): typeof Requirements.Type => ({
  amount,
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  extra: {
    name: "USDC",
    version: "2",
    ...extra,
  },
  maxTimeoutSeconds: timeout ?? 60,
  network: ChainIdString.make("eip155:8453"),
  payTo: recipient,
  scheme: "exact",
})
