import { HttpApi as HttpApi_, HttpApiError, OpenApi } from "@effect/platform"
import { X402 } from "crosshatch"

export class PublicApi extends HttpApi_.make("v1")
  .add(X402.Facilitator.Facilitator)
  .prefix("/v1")
  .addError(HttpApiError.NotFound)
  .annotate(OpenApi.Title, "crosshatch.dev")
  .annotate(OpenApi.Version, "v1") {}
