import { Effect, Schema as S, Option } from "effect"

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
  readonly chainId: typeof ChainId.Type
  readonly physical: PhysicalAsset
  readonly adapt: Adapt<never>
}

export class AcceptError extends S.TaggedErrorClass<AcceptError>()("AcceptError", { required: Required }) {}

export type Accept = (config: AcceptedConfig) => Effect.Effect<Accepted, AcceptError>

export const first = (denominations: Denominations): Accept => {
  const registry = new Map<
    string,
    {
      readonly chainId: typeof ChainId.Type
      readonly physical: PhysicalAsset
    }
  >()

  for (const denomination of Object.values(denominations)) {
    for (const logical of Object.values(denomination)) {
      for (const [namespace, references] of Object.entries(logical)) {
        for (const [reference, physical] of Object.entries(references)) {
          const chainId = ChainId.make(`${namespace}:${reference}`, {
            disableChecks: true,
          })

          registry.set(`${chainId}|${physical.asset.toLowerCase()}`, {
            chainId,
            physical,
          })
        }
      }
    }
  }

  return Effect.fnUntraced(function* ({ required }) {
    const { accepts } = required

    for (let acceptedI = 0; acceptedI < accepts.length; acceptedI++) {
      const accepted = accepts[acceptedI]!

      const entry = registry.get(`${accepted.network}|${accepted.asset.toLowerCase()}`)

      if (!entry) {
        continue
      }

      const { chainId, physical } = entry

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

        return {
          acceptedI,
          accepted,
          chainId,
          physical,
          adapt,
        }
      }
    }

    return yield* AcceptError.make({ required })
  })
}
