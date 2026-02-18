import { makeId } from "@crosshatch/util/schema"

export const ChatIdTypeId = Symbol()
export const ChatId = makeId(ChatIdTypeId, "ChatId")

export const ChatItemIdTypeId = Symbol()
export const ChatItemId = makeId(ChatItemIdTypeId, "ChatItemId")

export const EmbeddingIdTypeId = Symbol()
export const EmbeddingId = makeId(EmbeddingIdTypeId, "EmbeddingId")
