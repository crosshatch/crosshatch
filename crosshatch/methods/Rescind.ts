import { Schema as S } from "effect"
import { Method } from "liminal"

export const Rescind = Method.define({
  payload: S.Struct({}),
  success: S.Void,
  failure: S.Never,
})
