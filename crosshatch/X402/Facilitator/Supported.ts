import { description } from "@crosshatch/util/HttpApiUtil"
import { UnknownRecord } from "@crosshatch/util/schema"
import { HttpApiEndpoint } from "@effect/platform"
import { Schema as S } from "effect"

import { Network } from "../Network.ts"
import { Version } from "../Version.ts"

export const SupportedKind = S.Struct({
  x402Version: Version,
  scheme: S.String,
  network: Network,
  extra: UnknownRecord.pipe(S.optional),
})

export const Supported = HttpApiEndpoint.get("supported")`/supported`
  .addSuccess(
    S.Struct({
      kinds: S.Array(SupportedKind),
      extensions: S.Array(S.String),
      signers: S.Record({ key: S.String, value: S.Array(S.String) }),
    }),
  )
  .pipe(
    description`
      Returns the list of payment schemes, networks, and extensions supported by this facilitator,
      along with signer addresses keyed by CAIP-2 network family patterns.
    `,
  )
