import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"

import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Accepts = S.Tuple([Requirements], Requirements)

export const Required = S.Struct({
  accepts: Accepts,
  error: S.String.pipe(S.optional),
  extensions: UnknownRecord.pipe(S.optional),
  resource: ResourceInfo,
  x402Version: Version,
})

export const make = ({
  accepts,
  resource,
}: {
  accepts: typeof Accepts.Type
  resource: typeof ResourceInfo.Type
}): typeof Required.Type => ({
  accepts,
  resource,
  x402Version: 2,
})

export const parse = ({ accepts: [{ amount, asset, network }] }: typeof Required.Type) => ({
  amount: BigInt(amount),
  asset,
  network,
})
