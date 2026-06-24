import { Schema as S } from "effect"

export const LinkChallengeId = S.String.check(S.isUUID()).pipe(S.brand("LinkChallenge"))
