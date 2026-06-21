import { Schema as S } from "effect"

export class CaPaymentPayloadMakeError extends S.TaggedErrorClass<CaPaymentPayloadMakeError>()(
  "CaPaymentPayloadMakeError",
  {},
) {}
