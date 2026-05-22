import { Context, Schema as S } from "effect"

export const PaymentContextPart = S.TaggedUnion({})

export const PaymentMetadata = S.Struct({
  title: S.String,
  description: S.String,
})

export const PaymentContext = S.Struct({
  id: S.String.check(S.isUUID()),
  metadata: PaymentMetadata.pipe(S.optional),
})

// TODO: somehow separate from front-end concerns?
export class CurrentPaymentContext extends Context.Service<
  CurrentPaymentContext,
  {
    readonly id: string
    readonly metadata: typeof PaymentMetadata.Type
  }
>()("crosshatch/CurrentPaymentContext") {}
