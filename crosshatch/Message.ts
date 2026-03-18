import { Schema as S } from "effect"

import { Decision } from "./Decision.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

export class InitialMessage extends S.TaggedClass<InitialMessage>()("InitialMessage", {
  challengeId: LinkChallengeId,
}) {}

export class LinkedMessage extends S.TaggedClass<LinkedMessage>()("LinkedMessage", {}) {}

export class DecisionMessage extends S.TaggedClass<DecisionMessage>()("DecisionMessage", {
  proposalId: S.Number,
  decision: Decision,
}) {}

export const Message = S.Union(InitialMessage, LinkedMessage, DecisionMessage)
