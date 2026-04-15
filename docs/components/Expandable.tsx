import type { ReactNode } from "react"

import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import "../styles/mermaid-dark.css"

export function Expandable({ children }: { children: ReactNode }) {
  return <Zoom>{children}</Zoom>
}
