import { Context, Data, Effect } from "effect"

export class GetLatestBlockhashError extends Data.TaggedError("GetLatestBlockhashError")<{
  readonly cause?: unknown
}> {}

export interface Service<Blockhash> {
  readonly getLatestBlockhash: Effect.Effect<
    {
      readonly blockhash: Blockhash
      readonly lastValidBlockHeight: bigint
    },
    GetLatestBlockhashError
  >
}

const TypeId = "~crosshatch/State" as const

export interface State<Self, Id extends string, Blockhash extends string> extends Context.Service<
  Self,
  Service<Blockhash>
> {
  new (_: never): Context.ServiceClass.Shape<Id, Service<Blockhash>>

  readonly [TypeId]: typeof TypeId
}

export const Service =
  <Self, Blockhash extends string>() =>
  <Id extends string>(id: Id): State<Self, Id, Blockhash> => {
    const tag = Context.Service<Self, Service<Blockhash>>()(id)
    return Object.assign(tag, { [TypeId]: TypeId })
  }
