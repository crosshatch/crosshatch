import { Schema as S, flow, Option } from "effect"

// TODO: the following feels wrong... perhaps there's
// an existing standard brewing?
export const StandardExtra = S.Union(
  S.TaggedStruct("Response", {
    proposal: S.Struct({
      input: S.NonNegativeInt,
      output: S.NonNegativeInt,
      rebate: S.Boolean,
    }),
  }),
  S.TaggedStruct("Embedding", {
    proposal: S.Struct({
      input: S.NonNegativeInt,
      rebate: S.Boolean,
    }),
  }),
  S.TaggedStruct("Search", {
    proposal: S.Struct({
      queries: S.NonNegativeInt,
      results: S.NonNegativeInt,
      docFetches: S.NonNegativeInt,
      bytesReturned: S.NonNegativeInt,
      summaries: S.NonNegativeInt,
    }),
  }),
).pipe(
  S.extend(
    S.Struct({
      category: S.String,
      tags: S.Array(S.String).pipe(S.optional),
      contact: S.String,
      terms: S.String.pipe(S.optional),
    }),
  ),
)

export const make = (value: typeof StandardExtra.Type) => value

export const parse = flow(S.validateOption(StandardExtra), Option.getOrUndefined)
