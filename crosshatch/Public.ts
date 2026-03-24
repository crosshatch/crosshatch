import { HttpApi as HttpApi_, OpenApi } from "@effect/platform"
import { X402 } from "crosshatch"

export class Public extends HttpApi_.make("crosshatch")
  .add(X402.Facilitator.Facilitator)
  .annotate(OpenApi.Title, "crosshatch.dev") {}
