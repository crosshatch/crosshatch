import { Schema as S } from "effect"
import { Method } from "liminal"

export const Rescind = Method.make({
  payload: {},
  success: S.Void,
  failure: S.Never,
})
