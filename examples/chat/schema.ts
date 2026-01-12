import { added, columns, message, ordinal, ref } from "@crosshatch/config/drizzle"
import { makeId } from "@crosshatch/util"
import { relations } from "drizzle-orm"
import { index, pgTable, text, vector } from "drizzle-orm/pg-core"

export const ChatTypeId = Symbol()
export const ChatId = makeId(ChatTypeId)
export const chats = pgTable("chats", {
  ...columns(ChatId),
  ordinal,
  title: text("title"),
})

export const ChatItemTypeId = Symbol()
export const ChatItemId = makeId(ChatItemTypeId)
export const chatItems = pgTable("chat_items", {
  ...columns(ChatItemId),
  ordinal,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  message: message("message").notNull(),
  added,
})

export const EmbeddingTypeId = Symbol()
export const EmbeddingId = makeId(EmbeddingTypeId)
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
