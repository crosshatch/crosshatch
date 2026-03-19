import { LinkChallengeId } from "crosshatch"
import { ActorClient } from "liminal"

import { Propose } from "./requests/Propose.ts"
import { Rescind } from "./requests/Rescind.ts"

export class FacadeClient extends ActorClient.Service<FacadeClient>()("crosshatch/FacadeClient", {
  requests: [Propose, Rescind],
  events: {
    Challenged: {
      challengeId: LinkChallengeId,
    },
    Linked: {},
  },
}) {}
