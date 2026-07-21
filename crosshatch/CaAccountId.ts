import { Schema as S } from "effect"

import { Address } from "./Address.ts"
import { ChainId } from "./ChainId.ts"

export const CaAccountId = S.TemplateLiteral([ChainId, ":", Address]).pipe(S.brand("crosshatch/CaAccountId"))
