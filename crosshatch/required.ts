import { Required, Requirements } from "@crosshatch/x402"
import { Array } from "effect"

export const required = ({
  url,
  description,
  accepts,
}: {
  readonly url: string
  readonly description: string
  readonly accepts: Array.NonEmptyReadonlyArray<typeof Requirements.Requirements.Type>
}) =>
  Required.Required.make({
    x402Version: 2,
    accepts,
    resource: { url, description },
  })
