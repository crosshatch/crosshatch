import { Match, Context, Effect, Ref, Data, Stream, flow } from "effect"
import { Reducer } from "liminal"

import { FacadeClient } from "./FacadeClient.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

type State = Data.TaggedEnum<{
  Initial: {}
  Challenged: {
    challengeId: typeof LinkChallengeId.Type
  }
  Linked: {}
}>

export class Accumulator extends Context.Tag("crosshatch/Accumulator")<Accumulator, Ref.Ref<State>>() {}

type Item = Stream.Stream.Success<typeof FacadeClient.events>

const arm = Reducer.arm<State, Item>()

const Challenged = arm(
  "Challenged",
  ({ challengeId }) =>
    () =>
      Effect.succeed({ _tag: "Challenged", challengeId }),
)

const Linked = arm("Linked", () => () => Effect.succeed({ _tag: "Linked" }))

const reduce: Reducer.Reduce<State, Item> = flow(
  Match.value<Item>,
  Match.tagsExhaustive({
    Challenged,
    Linked,
  }),
)

export const stream = FacadeClient.events.pipe(
  Stream.scanEffect(
    {
      _tag: "Initial",
    } as State,
    (accumulator, item) => reduce(item)(accumulator),
  ),
)
