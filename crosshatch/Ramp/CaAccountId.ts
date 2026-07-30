import { Schema as S } from "effect"

import { Address, ChainId } from "../index.ts"

/** Encoded CAIP-10 account id — `chain_id:account_address`. */
export const CaAccountId = S.TemplateLiteral([ChainId.ChainId, ":", Address.Address]).pipe(
  S.brand("crosshatch/CaAccountId"),
)
