import type { HexString } from "@crosshatch/util"
import { Context, Effect } from "effect"

import type { Eip155 } from "./Eip155.ts"

export class Erc7710Delegator extends Context.Service<
  Erc7710Delegator,
  {
    readonly delegationManager: Eip155["Address"]["Type"]
    readonly permissionContext: HexString
    readonly delegator: Eip155["Address"]["Type"]
  }
>()("crosshatch/Cryptocurrency/Eip155/Erc7710Delegator") {}

export const getDelegation = Effect.gen(function* () {
  const erc7710 = yield* Effect.serviceOption(Erc7710Delegator)
  if (erc7710._tag === "Some") {
    return erc7710.value
  }
  return
})
