import { Schema as S, String } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { ChainFromString } from "../Chain.ts"
import { Version } from "../Version.ts"

// TODO: determine what to do about legacy chain IDs.
export type SupportedKind = typeof SupportedKind.Type
export const SupportedKind = S.Struct({
  x402Version: Version,
  scheme: S.String,
  network: S.Union([S.String.pipe(S.brand("crosshatch/LegacyChainId")), ChainFromString]),
  extra: S.JsonObject.pipe(S.optional),
})

export type SupportedResponse = typeof SupportedResponse.Type
export const SupportedResponse = S.Struct({
  kinds: S.Array(SupportedKind),
  extensions: S.Array(S.String),
  signers: S.Record(S.String, S.Array(S.String)),
})
export const SupportedResponseJson = S.toCodecJson(SupportedResponse)
export const SupportedResponseJsonString = S.fromJsonString(SupportedResponseJson)

export class SupportedEndpoint extends HttpApiEndpoint.get("supported", "/supported", {
  success: SupportedResponse,
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Returns the list of payment schemes, networks, and extensions supported by this facilitator,
  | along with signer addresses keyed by CAIP-2 network family patterns.
  `),
) {}
