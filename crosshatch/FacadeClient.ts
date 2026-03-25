import { Client } from "liminal"

import { LinkChallengeId } from "./LinkChallenge.ts"
import { Propose } from "./methods/Propose.ts"
import { Rescind } from "./methods/Rescind.ts"

export class FacadeClient extends Client.Service<FacadeClient>()("crosshatch/FacadeClient", {
  methods: { Propose, Rescind },
  events: {
    Challenged: {
      challengeId: LinkChallengeId,
    },
    Linked: {},
  },
}) {}
