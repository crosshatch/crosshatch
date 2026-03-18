import { Schema as S } from "effect"

import { Required } from "./X402/X402.ts"

export class Listen extends S.TaggedClass<Listen>()("Listen", {}) {}

export class Propose extends S.TaggedClass<Propose>()("Propose", {
  proposalId: S.Number,
  required: Required.Required,
}) {}

export class Unlink extends S.TaggedClass<Unlink>()("Unlink", {}) {}

export const Action = S.Union(Listen, Propose, Unlink)
