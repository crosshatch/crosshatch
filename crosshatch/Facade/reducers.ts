import { Effect } from "effect"

import { FacadeClient } from "./FacadeClient.ts"

export const Challenged = FacadeClient.reducer(
  "Challenged",
  ({ challengeId }) =>
    () =>
      Effect.succeed({ status: { _tag: "Challenged", challengeId } }),
)

export const Linked = FacadeClient.reducer("Linked", () => () => Effect.succeed({ status: { _tag: "Linked" } }))
