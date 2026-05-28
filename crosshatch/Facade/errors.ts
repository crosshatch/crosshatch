import { Schema as S } from "effect"

export class AssetNotSupportedError extends S.TaggedErrorClass<AssetNotSupportedError>()(
  "AssetNotSupportedError",
  {},
) {}

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
  InsufficientFundsError,
  InsufficientAllowanceRemainingError,
  AccountFrozenError,
  AppFrozenError,
  EscalationError,
])
