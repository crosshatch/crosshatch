import { Context } from "effect"

import type { Address } from "../Address.ts"
import type { CaAccountId } from "../CaAccountId.ts"
import type { ChainId } from "../ChainId.ts"

export interface AuthenticatedIdentity {
  readonly accountId: typeof CaAccountId.Type
  readonly address: typeof Address.Type
  readonly chainId: typeof ChainId.Type
}

export class Identity extends Context.Reference<AuthenticatedIdentity | undefined>("crosshatch/Siwx/Identity", {
  defaultValue: () => undefined,
}) {}
