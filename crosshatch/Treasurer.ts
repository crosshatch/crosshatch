import { Effect, Context, Layer } from "effect"

import { ChainId } from "./ChainId.ts"
import { NoSuchSupportedAssetError, RequirementSelectionError } from "./errors.ts"
import type { Deployment, PhysicalAssetLookup } from "./PhysicalAsset.ts"
import type { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"

export class Treasurer extends Context.Service<
  Treasurer,
  {
    readonly select: (required: typeof Required.Type) => Effect.Effect<
      {
        readonly config: {
          readonly accepted: typeof Requirements.Type
          readonly extensions?: Record<string, unknown> | undefined
        }
        readonly deployment: Deployment
      },
      RequirementSelectionError | NoSuchSupportedAssetError
    >
  }
>()("crosshatch/SelectRequirements") {}

// TODO: extensions
export const getFirstSupported = (supported: PhysicalAssetLookup) =>
  Effect.fnUntraced(function* (required: typeof Required.Type) {
    const { accepts } = required
    for (const asset of Object.values(supported)) {
      for (const [namespace, references] of Object.entries(asset.deployments)) {
        for (const [reference, deployment] of Object.entries(references)) {
          const network = ChainId.make(`${namespace}:${reference}`)
          for (const accepted of accepts) {
            if (network === accepted.network && deployment.asset === accepted.asset) {
              return {
                config: { accepted },
                deployment,
              }
            }
          }
        }
      }
    }
    return yield* new NoSuchSupportedAssetError({
      notFound: accepts.map(({ network: chainId, asset }) => ({ chainId, asset })),
    })
  })

export const layerFirstSupported = (supported: PhysicalAssetLookup) =>
  Layer.succeed(Treasurer, {
    select: getFirstSupported(supported),
  })
