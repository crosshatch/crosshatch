import { HttpApi, OpenApi } from "effect/unstable/httpapi"

import { Facilitator } from "./X402/Facilitator/Facilitator.ts"

export class Public extends HttpApi.make("crosshatch").add(Facilitator).annotate(OpenApi.Title, "crosshatch.dev") {}
