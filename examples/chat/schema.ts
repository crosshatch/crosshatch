import { added, Embeddings, index, message, ref, updated, uuid } from "@crosshatch/config/database"
import { relations } from "drizzle-orm"
import { pgTable, text } from "drizzle-orm/pg-core"

export const chats = pgTable("chats", {
  id: uuid,
  index,
  title: text("title"),
  updated,
})

export const chatItems = pgTable("chat_items", {
  id: uuid,
  index,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  message: message("message").notNull(),
  added,
})

export const chatItemsEmbeddings = Embeddings("chat_items_embeddings", () => chatItems.id)

export const chatItemsEmbeddingsRelations = relations(chatItems, ({ one }) => ({
  embeddings: one(chatItemsEmbeddings),
}))
