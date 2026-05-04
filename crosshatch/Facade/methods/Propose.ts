import { Payload, Required } from "@crosshatch/x402"
import { Schema as S } from "effect"
import { Method } from "liminal"

export const Propose = Method.make({
  payload: S.Struct({
    required: Required.Required,
  }),
  success: S.Struct({
    payload: Payload.Payload,
  }),
  failure: S.suspend(() => DeclinedError),
})

export class AssetNotSupportedError extends S.TaggedErrorClass<AssetNotSupportedError>()(
  "AssetNotSupportedError",
  {},
) {}

export class AllowanceDenialError extends S.TaggedErrorClass<AllowanceDenialError>()("AllowanceDenialError", {}) {}

export class InsufficientFundsError extends S.TaggedErrorClass<InsufficientFundsError>()(
  "InsufficientFundsError",
  {},
) {}

export class InsufficientAllowanceRemainingError extends S.TaggedErrorClass<InsufficientAllowanceRemainingError>()(
  "InsufficientAllowanceRemainingError",
  {},
) {}

export class AccountFrozenError extends S.TaggedErrorClass<AccountFrozenError>()("AccountFrozenError", {}) {}

export class AppFrozenError extends S.TaggedErrorClass<AppFrozenError>()("AppFrozenError", {}) {}

export class EscalationError extends S.TaggedErrorClass<EscalationError>()("EscalationError", {}) {}

export const DeclinedError = S.Union([
  AssetNotSupportedError,
  AllowanceDenialError,
  InsufficientFundsError,
  InsufficientAllowanceRemainingError,
  AccountFrozenError,
  AppFrozenError,
  EscalationError,
])
