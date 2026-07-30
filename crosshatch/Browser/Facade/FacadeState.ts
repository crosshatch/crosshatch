import { Context, Schema as S, type SubscriptionRef } from "effect"

import { LinkChallengeId } from "../Browser.ts"

type FacadeState_ = typeof FacadeState_.Type
const FacadeState_ = S.Struct({
  session: S.TaggedUnion({
    Challenged: { challengeId: LinkChallengeId },
    Linked: {
      // TODO
      // allowanceRemaining
      // addresses
    },
    Rescinded: {},
  }),
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface FacadeState extends FacadeState_ {}

export const FacadeState = Object.assign(
  Context.Service<FacadeState, SubscriptionRef.SubscriptionRef<FacadeState>>()("crosshatch/Browser/FacadeState"),
  FacadeState_,
)
