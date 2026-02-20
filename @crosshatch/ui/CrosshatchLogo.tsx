import type React from "react"

export interface CrosshatchLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string | undefined
}

export const CrosshatchLogo: React.FC<CrosshatchLogoProps> = ({ size, width, height, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 86.6"
    width={size ?? width}
    height={size ? undefined : height}
    role="img"
    aria-label="Crosshatch"
    {...props}
  >
    <title>Crosshatch</title>
    <path d="M50 0L60.25 17.91L21.29 86.6H0Z" fill="#0C456B" />
    <path d="M60.25 17.91L50.05 35.7L79.47 86.6H100Z" fill="#1771B7" />
    <path d="M31.84 67.98H68.68L57.96 86.6H21.41Z" fill="#8BC7ED" />
  </svg>
)
