import { Effect, Context, Ref, Schema as S } from "effect"

import { AssetConfigurationRef } from "./AssetConfiguration.ts"
import { ChainId } from "./ChainId.ts"
import type { Deployment } from "./PhysicalAsset.ts"
import { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"

export class AcceptError extends S.TaggedErrorClass<AcceptError>()("AcceptError", { required: Required }) {}

export class Accept extends Context.Reference<{
  readonly accept: ({
    assetConfigurationRef,
    required,
  }: {
    readonly assetConfigurationRef: AssetConfigurationRef["Service"]
    readonly required: typeof Required.Type
  }) => Effect.Effect<
    {
      readonly accepted: typeof Requirements.Type
      readonly chainId: typeof ChainId.Type
      readonly deployment: Deployment
    },
    AcceptError
  >
}>("crosshatch/Accept", {
  defaultValue: () => ({
    accept: Effect.fnUntraced(function* ({ assetConfigurationRef, required }) {
      const assetConfiguration = yield* Ref.get(assetConfigurationRef)
      const { accepts } = required
      for (const asset of Object.values(assetConfiguration)) {
        for (const [namespace, references] of Object.entries(asset.deployments)) {
          for (const [reference, deployment] of Object.entries(references)) {
            const chainId = ChainId.make(`${namespace}:${reference}`)
            for (const accepted of accepts) {
              if (chainId === accepted.network && deployment.asset === accepted.asset) {
                return { accepted, chainId, deployment }
              }
            }
          }
        }
      }
      return yield* new AcceptError({ required })
    }),
  }),
}) {}
