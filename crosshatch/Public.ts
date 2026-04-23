import { Facilitator } from "@crosshatch/x402/Facilitator"
import { HttpApi, OpenApi } from "effect/unstable/httpapi"

export class Public extends HttpApi.make("crosshatch").add(Facilitator).annotate(OpenApi.Title, "crosshatch.dev") {}
