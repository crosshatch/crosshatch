import { Schema as S, String } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { ChainId } from "../../ChainId.ts"
import { Extra } from "../../Extra.ts"
import { Version } from "../../Version.ts"

export const LegacyNetwork = S.Literals(["base-sepolia", "base", "solana-devnet", "solana"])

export const SupportedKind = S.Struct({
  x402Version: Version,
  scheme: S.String,
  network: S.Union([ChainId, LegacyNetwork]),
  extra: Extra.pipe(S.optional),
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
