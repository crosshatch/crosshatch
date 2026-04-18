import { Option, Match, Effect, Data, Stream } from "effect"
import { Accumulator } from "liminal"

import { FacadeClient } from "./FacadeClient.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

type State = Data.TaggedEnum<{
  Challenged: {
    challengeId: typeof LinkChallengeId.Type
  }
  Linked: {}
}>

export class FacadeState extends Accumulator.Service<FacadeState, State>()("crosshatch/Accumulator") {}

type Item = Stream.Success<typeof FacadeClient.events>

const arm = FacadeState.reducer<Item>()

const Challenged = arm(
  "Challenged",
  ({ challengeId }) =>
    () =>
      Effect.succeed({ _tag: "Challenged", challengeId }),
)

const Linked = arm("Linked", () => () => Effect.succeed({ _tag: "Linked" }))

export const layer = FacadeState.layer({
  source: FacadeClient.events,
  reduce: Match.valueTags({ Challenged, Linked }),
  initial: (item) =>
    Effect.succeed(item._tag === "Challenged" || item._tag === "Linked" ? Option.some(item) : Option.none()),
})
