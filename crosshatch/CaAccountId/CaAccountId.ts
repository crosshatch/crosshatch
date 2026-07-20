import { Data, Effect, Schema as S } from "effect"

import { Address } from "../Address.ts"
import { ChainId } from "../ChainId.ts"

export const CaAccountId = S.TemplateLiteral([ChainId, ":", Address]).pipe(S.brand("crosshatch/CaAccountId"))

export class CaAccountIdError extends Data.TaggedError("CaAccountIdError")<{ readonly cause?: unknown }> {}

export interface Builder {
  readonly supports: (chainId: string) => boolean
  readonly accountId: (chainId: string, address: string) => Effect.Effect<typeof CaAccountId.Type, CaAccountIdError>
}
