import { added, brandedId, message, ordinal, ref, updated } from "@crosshatch/drizzle"
import { makeId } from "@crosshatch/util"
import { relations } from "drizzle-orm"
import { index, pgTable, text, vector } from "drizzle-orm/pg-core"

export const ChatIdTypeId = Symbol()
export const ChatId = makeId(ChatIdTypeId, "ChatId")
export const chats = pgTable("chats", {
  id: brandedId<typeof ChatIdTypeId>(),
  ordinal,
  title: text("title"),
  updated,
})

export const ChatItemIdTypeId = Symbol()
export const ChatItemId = makeId(ChatItemIdTypeId, "ChatItemId")
export const chatItems = pgTable("chat_items", {
  id: brandedId<typeof ChatItemIdTypeId>(),
  ordinal,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  message: message("message").notNull(),
  added,
})

export const EmbeddingIdTypeId = Symbol()
export const EmbeddingId = makeId(EmbeddingIdTypeId, "EmbeddingId")
export const embeddings = pgTable("embeddings", {
  id: brandedId<typeof EmbeddingIdTypeId>(),
  embedding: vector("embedding", { dimensions: 384 }),
  chatItemId: ref("chat_item_id", () => chatItems.id, { onDelete: "cascade" }).notNull(),
}, (_) => [
  index("embeddings_embedding_index").using("hnsw", _.embedding.op("vector_cosine_ops")),
])

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  chatItem: one(chatItems, {
    fields: [embeddings.chatItemId],
    references: [chatItems.id],
  }),
}))
