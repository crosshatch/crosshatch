"use client"

import { Bot, Check, Copy, X } from "lucide-react"
import * as React from "react"

const prompts = [
  {
    label: "Merchants",
    description: "Build protected resources that require and settle x402 payments.",
    value: "merchant",
  },
  {
    label: "Effect AI clients",
    description: "Pay for Effect AI model calls through an x402-aware client.",
    value: "effect-ai-client",
  },
  {
    label: "Effect HTTP clients",
    description: "Pay for ordinary Effect HTTP requests with x402 client middleware.",
    value: "effect-http-client",
  },
] as const

export const CodingAgentsButton = (props: {
  readonly merchantPrompt: string
  readonly effectAiClientPrompt: string
  readonly effectHttpClientPrompt: string
}) => {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState<string | undefined>()

  const promptByValue = {
    merchant: props.merchantPrompt,
    "effect-ai-client": props.effectAiClientPrompt,
    "effect-http-client": props.effectHttpClientPrompt,
  }

  const onCopy = async (value: keyof typeof promptByValue) => {
    await navigator.clipboard.writeText(promptByValue[value])
    setCopied(value)
    window.setTimeout(() => setCopied(undefined), 5000)
  }

  return (
    <>
      <button
        className="vocs:inline-flex vocs:items-center vocs:justify-center vocs:px-5 vocs:py-2.5 vocs:rounded-lg vocs:text-[15px] vocs:font-medium vocs:transition-colors vocs:no-underline vocs:border vocs:cursor-pointer vocs:bg-surface vocs:border-primary vocs:text-heading vocs:hover:bg-surfaceTint"
        type="button"
        onClick={() => setOpen(true)}
      >
        Coding Agents
        <Bot className="ml-2 size-4 stroke-1" />
      </button>
      {open ? (
        <div className="crosshatch-agents-modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            aria-modal="true"
            className="crosshatch-agents-modal"
            role="dialog"
            aria-labelledby="crosshatch-agents-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close coding agents modal"
              className="crosshatch-agents-modal-close"
              type="button"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
            <p className="crosshatch-code-kicker">Coding Agents</p>
            <h2 id="crosshatch-agents-modal-title">Copy the right prompt</h2>
            <p>Paste one of these prompts into your agent so it starts with the right integration path.</p>
            <div className="crosshatch-agents-prompt-grid">
              {prompts.map((prompt) => (
                <button
                  className="crosshatch-agents-prompt-button"
                  key={prompt.value}
                  type="button"
                  onClick={() => onCopy(prompt.value)}
                >
                  <span>{prompt.label}</span>
                  <small>{prompt.description}</small>
                  <strong>
                    {copied === prompt.value ? (
                      <>
                        Copied
                        <Check />
                      </>
                    ) : (
                      <>
                        Copy prompt
                        <Copy />
                      </>
                    )}
                  </strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : undefined}
    </>
  )
}
