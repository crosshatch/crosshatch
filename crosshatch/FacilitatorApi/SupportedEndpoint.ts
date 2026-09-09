import { Schema as S } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { NetworkFromString } from "../Network.ts"
import { Version } from "../Version.ts"

export type SupportedKind = typeof SupportedKind.Type
export const SupportedKind = S.Struct({
  x402Version: Version,
  scheme: S.NonEmptyString,
  network: NetworkFromString,
  extra: S.JsonObject.pipe(S.optional),
})

export type SupportedResponse = typeof SupportedResponse.Type
export const SupportedResponse = S.Struct({
  kinds: S.Array(SupportedKind),
  extensions: S.Array(S.String),
  signers: S.Record(S.String, S.Array(S.String)),
})
export const SupportedResponseFromJsonString = S.fromJsonString(S.toCodecJson(SupportedResponse))

export class SupportedEndpoint extends HttpApiEndpoint.get("supported", "/supported", {
  success: SupportedResponse,
}).annotate(
  OpenApi.Description,
  `Returns the list of payment schemes, networks, and extensions supported by this facilitator, along with signer identifiers grouped by network selector.`,
) {}
