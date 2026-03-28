import { Schema as S } from "effect"

export class AuditionError extends S.TaggedError<AuditionError>()("AuditionError", {}) {}

export class ConnectionError extends S.TaggedError<ConnectionError>()("ConnectionError", {
  cause: S.Unknown,
}) {}

export type ClientError = AuditionError | ConnectionError

export class ClosedBeforeResolvedError extends S.TaggedError<ClosedBeforeResolvedError>()(
  "ClosedBeforeResolvedError",
  {},
) {}
