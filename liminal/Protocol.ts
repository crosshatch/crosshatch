import { Schema as S } from "effect"

export const DisconnectMessage = S.parseJson(S.TaggedStruct("Disconnect", {}))
