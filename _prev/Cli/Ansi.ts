const reset = "\u001B[0m"

const make =
  (code: number) =>
  (text: string): string =>
    `\u001B[${code}m${text}${reset}`

export const bold = make(1)
export const italicized = make(3)
export const underlined = make(4)
export const strikethrough = make(9)

export const red = make(31)
export const green = make(32)
export const yellow = make(33)
export const magenta = make(35)
export const white = make(37)
export const gray = make(90)
export const cyanBright = make(96)

export const success = (text: string): string => `${green("✔")} ${text}`
export const warning = (text: string): string => `${yellow("⚠")} ${text}`
export const error = (text: string): string => `${red("✖")} ${text}`
