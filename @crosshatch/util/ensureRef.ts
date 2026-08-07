import { Schema as S, Ref, type Context, Effect, Predicate, SchemaIssue } from "effect"

export const ensureRef = <Identifier, A>(tag: Context.Service<Identifier, Ref.Ref<A>>) =>
  tag.pipe(
    Effect.flatMap(Ref.get),
    Effect.filterOrFail(Predicate.isNotUndefined, () => new S.SchemaError(new SchemaIssue.InvalidValue())),
  )
