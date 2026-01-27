import type { ModelMessage } from "ai"

// TODO
export const Message = ({ message }: { message: ModelMessage }) => {
  return naive(message)
}

const naive = (message: ModelMessage) => {
  const { content } = message
  if (typeof content === "string") {
    return content
  }
  const [e0] = content
  if (e0?.type === "text") {
    return e0.text
  }
  throw 0
}
