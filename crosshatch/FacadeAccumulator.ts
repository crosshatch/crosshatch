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

export const layer = FacadeAccumulator.layer({
  source: FacadeClient.events,
  reducers: {
    Challenged: ({ challengeId }) =>
      FacadeAccumulator.set({
        challengeId: Option.some(challengeId),
      }),
    Linked: () =>
      FacadeAccumulator.set({
        challengeId: Option.none(),
      }),
  },
})
