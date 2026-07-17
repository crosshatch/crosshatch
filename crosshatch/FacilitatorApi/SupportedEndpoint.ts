import { Schema as S, String } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { JsonRecord } from "../_util.ts"
import { ChainId } from "../ChainId.ts"
import { Version } from "../Version.ts"

export const SupportedKind = S.Struct({
  x402Version: Version,
  scheme: S.String,
  network: S.Union([S.String.pipe(S.brand("crosshatch/LegacyChainId")), ChainId]),
  extra: JsonRecord.pipe(S.optional),
})

export const SupportedResponse = S.Struct({
  kinds: S.Array(SupportedKind),
  extensions: S.Array(S.String),
  signers: S.Record(S.String, S.Array(S.String)),
})

export const SupportedEndpoint = HttpApiEndpoint.get("supported", "/supported", {
  success: SupportedResponse,
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Returns the list of payment schemes, networks, and extensions supported by this facilitator,
  | along with signer addresses keyed by CAIP-2 network family patterns.
  `),
)
