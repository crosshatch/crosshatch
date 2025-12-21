import { Effect, Schema as S, Struct } from "effect"

export const unwrap = Effect.fn(function*(cred: Credential | null) {
  const cred_ = yield* S.validate(S.instanceOf(PublicKeyCredential))(cred)
  const { id, response } = cred_
  const prfv = yield* Effect.fromNullable(cred_.getClientExtensionResults().prf).pipe(
    Effect.map(Struct.get("results")),
    Effect.flatMap(Effect.fromNullable),
    Effect.map(Struct.get("first")),
  )
  return { id, response, prfv }
})
