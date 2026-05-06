import { Payload, Required } from "@crosshatch/x402"
import { Schema as S } from "effect"
import { DeclinedError } from "./errors.ts"

export const Rescind = {
  payload: S.Void,
  success: S.Void,
  failure: S.Never,
}

export const Propose = {
  payload: S.Struct({
    required: Required.Required,
  }),
  success: S.Struct({
    payload: Payload.Payload,
  }),
  failure: DeclinedError,
}
