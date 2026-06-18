import { AccountAddress, ChainIdString } from "@crosshatch/caip"
import { Requirements } from "@crosshatch/x402"
import { Schema as S, Array, Effect, Brand } from "effect"

export const AssetDeployment = S.Struct({
  address: AccountAddress,
  chainId: ChainIdString,
  decimals: S.Number,
  name: S.String,
  namespace: S.Literal("erc20"),
  symbol: S.String,
  version: S.String,
})

export const Asset = S.NonEmptyArray(AssetDeployment)

export const decodeSync = S.decodeSync(Asset)

export declare const requirements: <
  const A extends typeof Asset.Type,
  // TODO
  N extends Exclude<A[number]["chainId"], Brand.Brand<string>>,
>(
  amount: number,
  asset: A,
  recipients: {
    readonly [K in N]+?: typeof AccountAddress.Type | undefined
  },
) => Array.NonEmptyReadonlyArray<typeof Requirements.Requirements.Type>

export class NoSuchSupportedAssetError extends S.TaggedErrorClass<NoSuchSupportedAssetError>()(
  "NoSuchSupportedAssetError",
  {},
) {}

export const getFirstSupported = Effect.fnUntraced(function* (
  supported: Record<string, typeof Asset.Type>,
  accepts: ReadonlyArray<typeof Requirements.Requirements.Type>,
) {
  const deployments = Object.values(supported).flat(1)
  for (const deployment of deployments) {
    for (const accepted of accepts) {
      if (deployment.chainId === accepted.network && deployment.address === accepted.asset) {
        return { deployment, accepted }
      }
    }
  }
  return yield* new NoSuchSupportedAssetError()
})
