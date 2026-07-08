import { Effect, Context, Ref, Schema as S, Option } from "effect"

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
            for (const requirements of accepts) {
              if (chainId === requirements.network && deployment.asset === requirements.asset) {
                for (const tag of deployment.adapters) {
                  const adapter = yield* Effect.serviceOption(tag).pipe(Effect.map(Option.getOrUndefined))
                  if (!adapter) {
                    continue
                  }
                  yield* adapter.make(requirements)
                  return {
                    accepted: requirements,
                    chainId,
                    deployment,
                  }
                }
              }
            }
          }
        }
      }
      return yield* new AcceptError({ required })
    }),
  }),
}) {}
