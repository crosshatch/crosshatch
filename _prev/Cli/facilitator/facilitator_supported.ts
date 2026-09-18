import { Console, Effect, Schema as S } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as FacilitatorService from "../../Facilitator.ts"
import { SupportedResponseJsonString } from "../../FacilitatorApi/index.ts"

export const supported = Command.make("supported", {
  baseUrl: Flag.string("url").pipe(Flag.withDefault(undefined), Flag.withDescription("Facilitator base URL")),
}).pipe(
  Command.withDescription("List payment kinds supported by a facilitator"),
  Command.withHandler(
    Effect.fn(
      function* (_0) {
        const { supported } = yield* FacilitatorService.Facilitator
        yield* supported({}).pipe(
          Effect.flatMap(S.encodeEffect(SupportedResponseJsonString)),
          Effect.andThen(Console.log),
        )
      },
      (effect, { baseUrl }) => Effect.provide(effect, FacilitatorService.layer({ baseUrl })),
    ),
  ),
)
