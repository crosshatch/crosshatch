import { Schema as S, Ref, type Context, Effect, SchemaIssue } from "effect"

export const ensureRef = <Identifier, A>(tag: Context.Service<Identifier, Ref.Ref<A>>) =>
  tag.pipe(
    Effect.flatMap(Ref.get),
    Effect.filterOrFail(
      (v) => !!v,
      () => new S.SchemaError(new SchemaIssue.InvalidValue()),
    ),
  )
