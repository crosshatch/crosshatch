import { Prompt } from "@effect/ai"

// TODO
export const Message = ({ message }: { message: Prompt.Message }) => {
  return naive(message)
}

const naive = (message: Prompt.Message) => {
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
