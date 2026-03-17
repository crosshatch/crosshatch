import { Schema as S } from "effect"

import { Decision } from "./Decision.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

export class EnclaveInitial extends S.TaggedClass<EnclaveInitial>()("EnclaveInitial", {
  challengeId: LinkChallengeId,
}) {}

export class EnclaveLinked extends S.TaggedClass<EnclaveLinked>()("EnclaveLinked", {}) {}

export class EnclaveDecision extends S.TaggedClass<EnclaveDecision>()("EnclaveDecision", {
  proposalId: S.Number,
  decision: Decision,
}) {}

export const EnclaveMessage = S.Union(EnclaveInitial, EnclaveLinked, EnclaveDecision)
