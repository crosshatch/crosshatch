import { Client } from "liminal"
import * as events from "./events.ts"
import * as methods from "./methods.ts"

export class FacadeClient extends Client.Service<FacadeClient>()("crosshatch/FacadeClient", { events, methods }) {}
