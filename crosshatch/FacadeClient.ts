import { LinkChallengeId } from "crosshatch"
import { Client } from "liminal"

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
