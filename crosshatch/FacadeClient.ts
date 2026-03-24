import { Client } from "liminal"

import { LinkChallengeId } from "./LinkChallenge.ts"
import { Propose } from "./requests/Propose.ts"
import { Rescind } from "./requests/Rescind.ts"

export class FacadeClient extends Client.Service<FacadeClient>()("crosshatch/FacadeClient", {
  methods: { Propose, Rescind },
  events: {
    Challenged: {
      challengeId: LinkChallengeId,
    },
    Linked: {},
  },
}) {}
