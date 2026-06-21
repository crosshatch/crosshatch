import { Schema as S, SchemaTransformation } from "effect"

import * as Caip2 from "./2.ts"

/** CAIP-10 account address — format is namespace-specific. */
export const AccountAddress = S.String.check(S.isPattern(/^[-.%a-zA-Z0-9]{1,128}$/)).pipe(S.brand("AccountAddress"))

/** Encoded CAIP-10 account id — `chain_id:account_address`. */
export const AccountIdString = S.TemplateLiteral([Caip2.ChainIdString, ":", AccountAddress]).pipe(
  S.brand("AccountIdString"),
)

/** Parsed CAIP-10 account id. */
export const AccountIdParts = S.Struct({
  chainId: Caip2.ChainIdParts,
  accountAddress: AccountAddress,
})

/** CAIP-10 account id codec: `namespace:reference:account_address` ↔ `{ chainId, accountAddress }`. */
export const AccountId = AccountIdString.pipe(
  S.decodeTo(
    AccountIdParts,
    SchemaTransformation.transform({
      decode: (raw) => {
        const first = raw.indexOf(":")
        const second = raw.indexOf(":", first + 1)
        return {
          chainId: {
            namespace: raw.slice(0, first),
            reference: raw.slice(first + 1, second),
          },
          accountAddress: raw.slice(second + 1),
        }
      },
      encode: (parts) =>
        AccountIdString.make(`${parts.chainId.namespace}:${parts.chainId.reference}:${parts.accountAddress}`),
    }),
  ),
)
