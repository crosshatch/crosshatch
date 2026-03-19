import { Schema as S } from "effect"

export class Rescind extends S.TaggedRequest<Rescind>()("Rescind", {
  payload: {},
  success: S.Void,
  failure: S.Never,
}) {}
