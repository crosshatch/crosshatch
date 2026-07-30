import { Schema as S } from "effect"

import { LinkChallengeId } from "../Browser.ts"

export type FacadeState = typeof FacadeState.Type
export const FacadeState = S.Struct({
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
