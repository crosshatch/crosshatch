import { Schema as S, Effect } from "effect"
import { HttpRouter, HttpServerRequest } from "effect/unstable/http"

import { Payload } from "../Payload.ts"
import { Http402Payload } from "./Http402Payload.ts"

export const layer = HttpRouter.middleware<{ readonly provides: Http402Payload }>()(
  (httpEffect) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const header = request.headers["payment-signature"] ?? request.headers["x-payment"]
      const payload =
        header === undefined
          ? undefined
          : yield* Effect.matchEffect(
              S.decodeUnknownEffect(S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Payload)))))(
                header,
              ),
              {
                onFailure: () => Effect.succeed(undefined),
                onSuccess: Effect.succeed,
              },
            )
      return yield* Effect.provideService(httpEffect, Http402Payload, payload)
    }),
  { global: true },
)
