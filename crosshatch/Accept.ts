import { Effect, Context, Schema as S, Option, Layer } from "effect"

import type { Denomination, PhysicalAsset } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"
import { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"
import type { Adapt } from "./Scheme.ts"

export class AcceptError extends S.TaggedErrorClass<AcceptError>()("AcceptError", { required: Required }) {}

export class Accept extends Context.Service<
  Accept,
  ({ required }: { readonly required: typeof Required.Type }) => Effect.Effect<
    {
      readonly accepted: typeof Requirements.Type
      readonly acceptedI: number
      readonly chainId: typeof ChainId.Type
      readonly physical: PhysicalAsset
      readonly adapt: Adapt<never>
    },
    AcceptError
  >
>()("crosshatch/Accept") {}

export const layer = (denomination: Denomination) =>
  Layer.effect(
    Accept,
    Effect.gen(function* () {
      const context = yield* Effect.context<never>()
      return Effect.fnUntraced(function* ({ required }) {
        const { accepts } = required
        for (const asset of Object.values(denomination)) {
          for (const [namespace, references] of Object.entries(asset)) {
            for (const [reference, physical] of Object.entries(references)) {
              const chainId = ChainId.make(`${namespace}:${reference}`)
              for (let acceptedI = 0; acceptedI < accepts.length; acceptedI++) {
                const accepted = accepts[acceptedI]!
                if (chainId === accepted.network && physical.asset === accepted.asset) {
                  for (const tag of physical.schemes) {
                    const adapter = context.pipe(Context.getOption(tag), Option.getOrUndefined)
                    if (!adapter) {
                      continue
                    }
                    const adapt = yield* adapter({ accepted, physical }).pipe(
                      Effect.catchTags({
                        SchemaError: () => Effect.undefined,
                      }),
                    )
                    if (!adapt) {
                      continue
                    }
                    return { acceptedI, accepted, chainId, physical, adapt }
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
