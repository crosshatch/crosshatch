import { Client } from "liminal"
import * as events from "./events.ts"
import * as methods from "./methods.ts"
import { Schema as S } from "effect"
import { LinkChallengeId } from "../LinkChallengeId.ts"

export class FacadeClient extends Client.Service<FacadeClient>()("crosshatch/FacadeClient", {
  events,
  methods,
  state: {
    status: S.TaggedUnion({
      Challenged: {
        challengeId: LinkChallengeId,
      },
      Linked: {},
    }),
  },
}) {}
