import { HttpApi as HttpApi_, HttpApiError, OpenApi } from "@effect/platform"

import { Facilitator } from "./X402/Facilitator/Facilitator.ts"

export class Public extends HttpApi_.make("v1")
  .add(Facilitator)
  .prefix("/v1")
  .addError(HttpApiError.NotFound)
  .annotate(OpenApi.Title, "crosshatch.dev")
  .annotate(OpenApi.Version, "v1") {}
