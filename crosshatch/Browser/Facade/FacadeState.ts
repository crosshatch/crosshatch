import { Context, Layer, Schema as S, PubSub } from "effect"

import { LinkChallengeId } from "../LinkChallengeId.ts"

type FacadeState_ = typeof FacadeState_.Type
const FacadeState_ = S.Struct({
  session: S.TaggedUnion({
    Challenged: {
      challengeId: LinkChallengeId,
    },
    Linked: {},
  }),
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface FacadeState extends FacadeState_ {}

export const FacadeState = Object.assign(
  Context.Service<FacadeState, PubSub.PubSub<FacadeState>>()("link.crosshatch.dev/FacadeState", {
    make: PubSub.unbounded<FacadeState>({ replay: 1 }),
  }),
  FacadeState_,
)

export const layer = Layer.effect(FacadeState, FacadeState.make)
