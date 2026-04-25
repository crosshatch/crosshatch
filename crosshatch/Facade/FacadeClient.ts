import { Client } from "liminal/actor"

import * as events from "./events.ts"
import { Propose } from "./methods/Propose.ts"
import { Rescind } from "./methods/Rescind.ts"

export class FacadeClient extends Client.Service<FacadeClient>()("crosshatch/FacadeClient", {
  methods: { Propose, Rescind },
  events,
}) {}
