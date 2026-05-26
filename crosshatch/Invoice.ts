import { Schema as S } from "effect"

export const InvoiceId = S.String.check(S.isUUID()).pipe(S.brand("Invoice"))
