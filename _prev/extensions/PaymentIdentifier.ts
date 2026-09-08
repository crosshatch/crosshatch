import { Schema as S } from "effect"

import { Extension } from "../index.ts"

export class PaymentIdentifier extends Extension.Service<PaymentIdentifier>()(
  "crosshatch/Extensions/PaymentIdentifier",
  {
    xKey: "payment-identifier",
    info: S.Struct({
      required: S.Boolean,
      id: S.String.pipe(S.optionalKey),
    }),
    enrichment: S.Struct({
      required: S.Boolean,
      id: S.String,
    }),
  },
) {}
