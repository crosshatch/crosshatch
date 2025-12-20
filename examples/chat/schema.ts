import { added, Embeddings, id, index, message, ref, updated } from "@crosshatch/config/database"
import { relations } from "drizzle-orm"
import { pgTable, text } from "drizzle-orm/pg-core"

export const chats = pgTable("chats", {
  id,
  index,
  title: text("title"),
  updated,
})

export const chatItems = pgTable("chat_items", {
  id,
  index,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  message: message("message").notNull(),
  added,
})

export const chatItemsEmbeddings = Embeddings("chat_items_embeddings", () => chatItems.id)

export const chatItemsEmbeddingsRelations = relations(chatItems, ({ one }) => ({
  embeddings: one(chatItemsEmbeddings),
}))
