import { Effect, Context, Schema as S, Option, Layer } from "effect"

import type { Adapt } from "./Adapter.ts"
import type { AssetConfig, PhysicalAssetDeployment } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"
import { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"

export class AcceptError extends S.TaggedErrorClass<AcceptError>()("AcceptError", { required: Required }) {}

export class Accept extends Context.Service<
  Accept,
  ({ required }: { readonly required: typeof Required.Type }) => Effect.Effect<
    {
      readonly accepted: typeof Requirements.Type
      readonly chainId: typeof ChainId.Type
      readonly deployment: PhysicalAssetDeployment
      readonly adapt: Adapt
    },
    AcceptError
  >
>()("crosshatch/Accept") {}

export const layer = (assets: AssetConfig) =>
  Layer.effect(
    Accept,
    Effect.gen(function* () {
      const context = yield* Effect.context<never>()
      return Effect.fnUntraced(function* ({ required }) {
        const { accepts } = required
        for (const asset of Object.values(assets)) {
          for (const [namespace, references] of Object.entries(asset.deployments)) {
            for (const [reference, deployment] of Object.entries(references)) {
              const chainId = ChainId.make(`${namespace}:${reference}`)
              for (const accepted of accepts) {
                if (chainId === accepted.network && deployment.asset === accepted.asset) {
                  for (const tag of deployment.adapters) {
                    const adapter = Context.getOption(context, tag).pipe(Option.getOrUndefined)
                    if (!adapter) {
                      continue
                    }
                    const adapt = yield* adapter({ accepted, deployment }).pipe(
                      Effect.option,
                      Effect.map(Option.getOrUndefined),
                    )
                    if (!adapt) {
                      continue
                    }
                    return { accepted, chainId, deployment, adapt }
                  }
                }
              }
            }
          }
        }
        return yield* new AcceptError({ required })
      })
    }),
  )
