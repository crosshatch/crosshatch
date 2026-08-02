import { Schema as S } from "effect"

export type LinkChallengeId = typeof LinkChallengeId.Type
export const LinkChallengeId = S.String.check(S.isUUID()).pipe(S.brand("crosshatch/Browser/LinkChallenge"))
