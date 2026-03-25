import { Schema as S } from "effect"
import { Method } from "liminal"

export const Rescind = Method.define({
  payload: {},
  success: S.Void,
  failure: S.Never,
})
