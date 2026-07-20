import { Layer } from "effect"

import * as Eip155Signer from "../Eip155/Eip155Signer.ts"
// oxlint-disable-next-line unicorn/prefer-export-from
import * as Siwe from "./Siwe.ts"
// oxlint-disable-next-line unicorn/prefer-export-from
import * as Siws from "./Siws.ts"

export * as Challenge from "./Challenge.ts"
export * as ChallengeStore from "./ChallengeStore.ts"
export * as Client from "./Client.ts"
export * as Entitlement from "./Entitlement.ts"
export * as Entitlements from "./Entitlements.ts"
export * as EntitlementStore from "./EntitlementStore.ts"
export * as Identity from "./Identity.ts"
export * as Prover from "./Prover.ts"
export * as Schema from "./Schema.ts"
export * as Server from "./Server.ts"
export { Siwe, Siws }
export * as Verification from "./Verification.ts"
export * as Verifier from "./Verifier.ts"

export const layerProvers = Layer.mergeAll(Eip155Signer.layerMnemonic, Siws.layerMnemonic)

export const layerVerifiersRpc = Siwe.layerVerifierRpc
