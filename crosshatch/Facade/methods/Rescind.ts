import { Schema as S } from "effect"
import { Method } from "liminal/actor"

export const Rescind = Method.make({
  payload: S.Struct({}),
  success: S.Void,
  failure: S.Never,
})
