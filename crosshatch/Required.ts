import { type Effect, Schema as S } from "effect"

import { ExtensionsEnvelope } from "./ExtensionsEnvelope.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export class Required extends S.Class<Required>("Required")({
  x402Version: Version,
  resource: ResourceInfo,
  accepts: S.Array(Requirements),
  error: S.String.pipe(S.optional),
  extensions: ExtensionsEnvelope.pipe(S.optional),
}) {}

export declare const describe: {
  (accepts: ReadonlyArray<Requirements>, description?: string): Effect.Effect<Required, S.SchemaError>
  (
    e0?: TemplateStringsArray | string,
    ...substitutions: ReadonlyArray<unknown>
  ): (accepts: ReadonlyArray<Requirements>) => Effect.Effect<Required, S.SchemaError>
}
