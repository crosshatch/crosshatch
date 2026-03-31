import { Schema as S } from "effect"

export class AuditionError extends S.TaggedError<AuditionError>()("AuditionError", {
  value: S.Struct({
    actual: S.String,
    expected: S.String,
  }).pipe(S.optional),
}) {}

export class ConnectionError extends S.TaggedError<ConnectionError>()("ConnectionError", {
  cause: S.Unknown,
}) {}

export class StartupClosedError extends S.TaggedError<StartupClosedError>()("StartupClosedError", {}) {}

export type ClientError = AuditionError | ConnectionError | StartupClosedError

export class ClosedBeforeResolvedError extends S.TaggedError<ClosedBeforeResolvedError>()(
  "ClosedBeforeResolvedError",
  {},
) {}
