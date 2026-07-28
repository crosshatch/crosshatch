import { Console, Effect, Option, Schema as S } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as FacilitatorService from "../../Facilitator.ts"
import { SupportedResponse } from "../../FacilitatorApi/SupportedEndpoint.ts"

export const supported = Command.make("supported", {
  baseUrl: Flag.string("url").pipe(
    Flag.withDescription("Facilitator base URL"),
    Flag.optional,
    Flag.map(Option.getOrUndefined),
  ),
}).pipe(
  Command.withDescription("List payment kinds supported by a facilitator"),
  Command.withHandler(
    Effect.fn(({ baseUrl }) =>
      Effect.gen(function* () {
        const facilitator = yield* FacilitatorService.Facilitator
        const response = yield* facilitator.supported({})
        const json = yield* S.encodeEffect(S.fromJsonString(S.toCodecJson(SupportedResponse)))(response)
        yield* Console.log(json)
      }).pipe(Effect.provide(FacilitatorService.layer({ baseUrl }))),
    ),
  ),
)
