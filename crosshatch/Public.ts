import { HttpApi as HttpApi_, OpenApi } from "@effect/platform"

import { Facilitator } from "./x402/Facilitator/Facilitator.ts"

export class Public extends HttpApi_.make("crosshatch").add(Facilitator).annotate(OpenApi.Title, "crosshatch.dev") {}
