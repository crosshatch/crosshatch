import { Effect, Schema as S, Option, Record } from "effect"

import type { Denominations, PhysicalAsset } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"
import { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"
import type { Adapt } from "./Scheme.ts"

export interface AcceptedConfig {
  readonly required: Required
}

export interface Accepted {
  readonly accepted: Requirements
  readonly acceptedI: number
  readonly chainId: ChainId
  readonly physical: PhysicalAsset
  readonly adapt: Adapt<never>
}

export class AcceptError extends S.TaggedError<AcceptError>()("AcceptError", { required: Required }) {}

export type Accept = (config: AcceptedConfig) => Effect.Effect<Accepted, AcceptError>

export const first = (denominations: Denominations): Accept =>
  Effect.fnUntraced(function* ({ required }) {
    const { accepts } = required
    for (const denomination of Record.values(denominations)) {
      for (const logical of Record.values(denomination)) {
        for (const [namespace, references] of Record.toEntries(logical)) {
          for (const [reference, physical] of Record.toEntries(references)) {
            const chainId = ChainId.make(`${namespace}:${reference}`, { disableChecks: true })
            for (let acceptedI = 0; acceptedI < accepts.length; acceptedI++) {
              const accepted = accepts[acceptedI]!
              if (chainId === accepted.network && physical.asset === accepted.asset) {
                for (const tag of physical.schemes) {
                  const adapter = yield* Effect.serviceOption(tag).pipe(Effect.map(Option.getOrUndefined))
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
    }
    return yield* AcceptError.make({ required })
  })
