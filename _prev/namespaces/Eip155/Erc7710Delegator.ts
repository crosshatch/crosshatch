import type { HexString } from "@crosshatch/util"
import { Context, Effect } from "effect"

import type { Address } from "../../index.ts"
import type { Eip155 } from "./Eip155.ts"

export class Erc7710Delegator extends Context.Service<
  Erc7710Delegator,
  {
    readonly delegationManager: Address.Address<Eip155>
    readonly permissionContext: HexString
    readonly delegator: Address.Address<Eip155>
  }
>()("crosshatch/namespaces/Eip155/Erc7710Delegator") {}

export type Erc7710DelegatorPayload = {
  readonly delegationManager: string
  readonly permissionContext: string
  readonly delegator: string
}

export const getDelegation: Effect.Effect<Erc7710DelegatorPayload | undefined> = Effect.gen(function* () {
  const erc7710 = yield* Effect.serviceOption(Erc7710Delegator)
  if (erc7710._tag === "Some") {
    const { delegationManager, permissionContext, delegator } = erc7710.value
    return {
      delegationManager: delegationManager.raw,
      delegator: delegator.raw,
      permissionContext,
    }
  }
  return
})
