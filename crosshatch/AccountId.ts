import { Schema as S } from "effect"

import { brand } from "./_common.ts"
import { Address } from "./Address.ts"
import { ChainId } from "./ChainId.ts"

export type AccountId = typeof AccountId.Type
export const AccountId = S.TemplateLiteralParser([ChainId, ":", Address]).pipe(brand("AccountId"))
