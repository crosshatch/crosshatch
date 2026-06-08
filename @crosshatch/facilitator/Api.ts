import { Facilitator } from "@crosshatch/x402/Facilitator"
import { HttpApi } from "effect/unstable/httpapi"

export class Api extends HttpApi.make("crosshatch").add(Facilitator) {}
