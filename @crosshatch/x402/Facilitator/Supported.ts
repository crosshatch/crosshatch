import { ChainIdString } from "@crosshatch/caip"
import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { Version } from "../Version.ts"

export const SupportedKind = S.Struct({
  x402Version: Version,
  scheme: S.String,
  network: ChainIdString,
  extra: UnknownRecord.pipe(S.optional),
})

export const Supported = HttpApiEndpoint.get("supported", "/supported", {
  success: S.Struct({
    kinds: S.Array(SupportedKind),
    extensions: S.Array(S.String),
    signers: S.Record(S.String, S.Array(S.String)),
  }),
}).annotate(
  OpenApi.Description,
  `
    Returns the list of payment schemes, networks, and extensions supported by this facilitator,
    along with signer addresses keyed by CAIP-2 network family patterns.
  `,
)
