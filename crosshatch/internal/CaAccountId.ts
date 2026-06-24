import { Schema as S } from "effect"

import { Address } from "../Address.ts"
import { ChainId } from "../ChainId.ts"

/** Encoded CAIP-10 account id — `chain_id:account_address`. */
export const CaAccountId = S.TemplateLiteral([ChainId, ":", Address]).pipe(S.brand("AccountId"))
