import { Option, Schema as S } from "effect"
import { Accumulator } from "liminal"

import { FacadeClient } from "./FacadeClient.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

export class FacadeAccumulator extends Accumulator.Service<FacadeAccumulator>()("crosshatch/FacadeAccumulator", {
  fields: {
    challengeId: S.Option(LinkChallengeId),
  },
  events: FacadeClient.definition.events,
}) {}

const Challenged = FacadeAccumulator.reducer("Challenged", ({ challengeId }) =>
  FacadeAccumulator.set({
    challengeId: Option.some(challengeId),
  }),
)

const Linked = FacadeAccumulator.reducer("Linked", () =>
  FacadeAccumulator.set({
    challengeId: Option.none(),
  }),
)

export const layer = Accumulator.layer({
  accumulator: FacadeAccumulator,
  source: FacadeClient.events,
  reducers: { Challenged, Linked },
})
