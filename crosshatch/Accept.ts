import { Effect, Context, Schema as S, Option, Layer, Record } from "effect"

import type { Denomination, PhysicalAsset } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"
import { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"
import type { Adapt } from "./Scheme.ts"

export class AcceptError extends S.TaggedErrorClass<AcceptError>()("AcceptError", { required: Required }) {}

export class Accept extends Context.Service<
  Accept,
  ({ required }: { readonly required: Required }) => Effect.Effect<
    {
      readonly accepted: Requirements
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
        for (const asset of Record.values(denomination)) {
          for (const [namespace, references] of Record.toEntries(asset)) {
            for (const [reference, physical] of Record.toEntries(references)) {
              const chainId = ChainId.make(`${namespace}:${reference}`, { disableChecks: true })
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
