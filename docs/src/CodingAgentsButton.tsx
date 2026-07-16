"use client"

import { Bot, Check, Copy, X } from "lucide-static"
import * as React from "react"

import { LucideIcon } from "./LucideIcon"

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

// const MCP_URL = "https://crosshatch.dev/api/mcp"

export const CodingAgentsButton = (props: {
  readonly merchantPrompt: string
  readonly effectAiClientPrompt: string
  readonly effectHttpClientPrompt: string
}) => {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState<string | undefined>()
  const [modalTopOffset, setModalTopOffset] = React.useState(0)

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

  // const onCopyMcpUrl = async () => {
  //   await navigator.clipboard.writeText(MCP_URL)
  //   setCopied("mcp")
  //   window.setTimeout(() => setCopied(undefined), 5000)
  // }

  React.useLayoutEffect(() => {
    if (!open) return

    const updateModalTopOffset = () => {
      const headerBottom = Array.from(document.querySelectorAll("[data-v-banner], [data-v-gutter-top]"))
        .map((element) => element.getBoundingClientRect().bottom)
        .reduce((max, bottom) => Math.max(max, bottom), 0)

      setModalTopOffset(headerBottom)
    }

    updateModalTopOffset()
    window.addEventListener("resize", updateModalTopOffset)

    return () => window.removeEventListener("resize", updateModalTopOffset)
  }, [open])

  return (
    <>
      <button
        className="vocs:inline-flex vocs:items-center vocs:justify-center vocs:px-5 vocs:py-2.5 vocs:rounded-lg vocs:text-[15px] vocs:font-medium vocs:transition-colors vocs:no-underline vocs:border vocs:cursor-pointer vocs:bg-surface vocs:border-primary vocs:text-heading vocs:hover:bg-surfaceTint"
        type="button"
        onClick={() => setOpen(true)}
      >
        Coding Agents
        <LucideIcon className="ml-2 size-4 stroke-1" svg={Bot} />
      </button>
      {open ? (
        <div
          className="crosshatch-agents-modal-backdrop"
          role="presentation"
          style={{ "--crosshatch-agents-modal-top-offset": `${modalTopOffset}px` } as React.CSSProperties}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <div
            aria-modal="true"
            className="crosshatch-agents-modal"
            role="dialog"
            aria-labelledby="crosshatch-agents-modal-title"
          >
            <button
              aria-label="Close coding agents modal"
              className="crosshatch-agents-modal-close"
              type="button"
              onClick={() => setOpen(false)}
            >
              <LucideIcon svg={X} />
            </button>
            <p className="crosshatch-code-kicker">Coding Agents</p>
            <h2 id="crosshatch-agents-modal-title">Give agents the right context</h2>
            <p>Connect the Crosshatch docs MCP server, then paste one of these integration-specific prompts.</p>
            {/* <section className="crosshatch-agents-mcp" aria-labelledby="crosshatch-agents-mcp-title">
              <div>
                <h3 id="crosshatch-agents-mcp-title">Docs MCP server</h3>
                <code className="px-0">{MCP_URL}</code>
              </div>
              <button type="button" onClick={onCopyMcpUrl}>
                {copied === "mcp" ? (
                  <>
                    Copied
                    <LucideIcon svg={Check} />
                  </>
                ) : (
                  <>
                    Copy URL
                    <LucideIcon svg={Copy} />
                  </>
                )}
              </button>
            </section> */}
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
                        <LucideIcon svg={Check} />
                      </>
                    ) : (
                      <>
                        Copy prompt
                        <LucideIcon svg={Copy} />
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
