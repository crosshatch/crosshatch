import { HttpApi as HttpApi_, OpenApi } from "@effect/platform"

import { Facilitator } from "./X402/Facilitator/Facilitator.ts"

export class Public extends HttpApi_.make("crosshatch").add(Facilitator).annotate(OpenApi.Title, "crosshatch.dev") {}
