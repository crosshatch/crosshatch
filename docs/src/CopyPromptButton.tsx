"use client"

import * as React from "react"

export const CopyPromptButton = (props: {
  children: React.ReactNode
  prompt: string
  variant?: "default" | "accent"
}) => {
  const { children, prompt } = props
  const [copied, setCopied] = React.useState(false)

  const onClick = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      className="vocs:inline-flex vocs:items-center vocs:justify-center vocs:px-5 vocs:py-2.5 vocs:rounded-lg vocs:text-[15px] vocs:font-medium vocs:transition-colors vocs:no-underline vocs:border vocs:cursor-pointer vocs:bg-surface vocs:border-primary vocs:text-heading vocs:hover:bg-surfaceTint"
      type="button"
      {...{ onClick }}
    >
      {copied ? "Copied Prompt" : children}
    </button>
  )
}
