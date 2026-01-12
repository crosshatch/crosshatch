import { added, columns, message, ordinal, ref } from "@crosshatch/config/drizzle"
import { makeId } from "@crosshatch/util"
import { relations } from "drizzle-orm"
import { index, pgTable, text, vector } from "drizzle-orm/pg-core"

export const ChatIdTypeId = Symbol()
export const ChatId = makeId(ChatIdTypeId, "ChatId")
export const chats = pgTable("chats", {
  ...columns(ChatId),
  ordinal,
  title: text("title"),
})

export const ChatItemIdTypeId = Symbol()
export const ChatItemId = makeId(ChatItemIdTypeId, "ChatItemId")
export const chatItems = pgTable("chat_items", {
  ...columns(ChatItemId),
  ordinal,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  message: message("message").notNull(),
  added,
})

export const EmbeddingIdTypeId = Symbol()
export const EmbeddingId = makeId(EmbeddingIdTypeId, "EmbeddingId")
export const embeddings = pgTable("embeddings", {
  ...columns(EmbeddingId),
  embedding: vector("embedding", { dimensions: 384 }),
  chatItemId: ref("chat_item_id", () => chatItems.id, { onDelete: "cascade" }).notNull(),
}, (_) => [
  index("embeddings").using("hnsw", _.embedding.op("vector_cosine_ops")),
])

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  chatItem: one(chatItems, {
    fields: [embeddings.chatItemId],
    references: [chatItems.id],
  }),
}))
