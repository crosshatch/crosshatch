import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (_) => ({
  embeddings: {
    chat: _.one.chatItems({
      to: _.chatItems.id,
      from: _.embeddings.chatItemId,
    }),
  },
}))
