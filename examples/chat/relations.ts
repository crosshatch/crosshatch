import { defineRelations } from "drizzle-orm"

import * as schema from "./schema"

export const relations = defineRelations(schema, (_) => ({
  embeddings: {
    chat: _.one.chatItems({
      from: _.embeddings.chatItemId,
      to: _.chatItems.id,
    }),
  },
}))
