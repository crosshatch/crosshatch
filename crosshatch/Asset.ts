import { AccountAddress, ChainIdString, CaChain } from "crosshatch/Ca"
import { Requirements } from "crosshatch/X402"
import { Record, Effect, Duration, Context } from "effect"

import { usdToAtomic, usdFromNumber } from "./Amount.ts"
import { NoSuchSupportedAssetError } from "./errors.ts"

export type Asset = Record<string, Record<string, AssetDeployment>>

export interface AssetDeployment {
  readonly address: typeof AccountAddress.Type
  readonly assetNamespace: "erc20"
  readonly decimals: number
  readonly name: string
  readonly symbol: string
  readonly version: string
  readonly service: Context.ServiceClass<any, any, CaChain.CaChain>
}

export const requirements = <A extends Asset>(
  asset: A,
  {
    amount,
    recipients,
    ttl,
  }: {
    amount: number
    recipients: {
      [K in keyof A]: {
        [K2 in keyof A[K]]+?: typeof AccountAddress.Type | undefined
      }
    }
    ttl?: Duration.Input | undefined
  },
): ReadonlyArray<typeof Requirements.Requirements.Type> => {
  const maxTimeoutSeconds = ttl ? Math.ceil(Duration.fromInputUnsafe(ttl).pipe(Duration.toSeconds)) : 300
  return Record.toEntries(recipients).flatMap(([namespace, references]) =>
    Record.toEntries(references).reduce(
      (acc, [reference, payTo]) => {
        const deployment = asset[namespace]![reference]!
        const { name, version } = deployment
        return [
          ...acc,
          ...(payTo
            ? [
                {
                  amount: usdToAtomic(usdFromNumber(amount), deployment),
                  asset: AccountAddress.make(deployment.address),
                  maxTimeoutSeconds,
                  network: ChainIdString.make(`${namespace}:${reference}`),
                  payTo,
                  scheme: "exact",
                  extra: { name, version },
                } satisfies typeof Requirements.Requirements.Type,
              ]
            : []),
        ]
      },
      [] as ReadonlyArray<typeof Requirements.Requirements.Type>,
    ),
  )
}

export const getFirstSupported = Effect.fnUntraced(function* (
  supported: Record<string, Asset>,
  accepts: ReadonlyArray<typeof Requirements.Requirements.Type>,
) {
  for (const asset of Object.values(supported)) {
    for (const [namespace, references] of Object.entries(asset)) {
      for (const [reference, deployment] of Object.entries(references)) {
        const network = ChainIdString.make(`${namespace}:${reference}`)
        for (const accepted of accepts) {
          if (network === accepted.network && deployment.address === accepted.asset) {
            return { accepted, deployment, network }
          }
        }
      }
    }
  }
  return yield* new NoSuchSupportedAssetError()
})
