import { prefix } from "@crosshatch/util"
import { Headers, HttpApiError, HttpApiMiddleware, HttpServerRequest } from "@effect/platform"
import { Effect, Layer, Option, pipe } from "effect"
import { config } from "./config.ts"

export class EnsureOriginMiddleware extends HttpApiMiddleware.Tag<EnsureOriginMiddleware>()(
  prefix("@crosshatch/util/EnsureOriginMiddleware"),
  { failure: HttpApiError.Unauthorized },
) {}

export const layerEnsureOriginMiddleware = ({ origin }: { origin: string }) =>
  Layer.effect(
    EnsureOriginMiddleware,
    Effect.gen(function*() {
      const dev = yield* config.dev
      return Effect.gen(function*() {
        let { headers } = yield* HttpServerRequest.HttpServerRequest
        if (!dev) {
          yield* pipe(
            headers,
            Headers.get("host"),
            Option.map((v) => `https://${v}` !== origin),
            Effect.flatMap((v) => v ? new HttpApiError.Unauthorized() : Effect.void),
          )
        }
      }).pipe(
        Effect.catchTag("NoSuchElementException", Effect.die),
      )
    }),
  )
