import { cn } from "../cn.ts"
import { useCopy } from "../hooks/useCopy.ts"
import { Button } from "./Button.tsx"
import { CheckIcon, ClipboardIcon } from "lucide-react"

const iconProps = { className: "size-4 stroke-1 opacity-50" }

// TODO: clean up trunaction
export const AddressButton = ({
  address,
  className,
  left,
}: {
  address: string
  className?: string | undefined
  left?: React.ReactNode
}) => {
  const { copied, copy } = useCopy(address)
  return (
    <Button className={cn("w-full flex-row gap-2", className)} variant="outline" onClick={copy}>
      {left}
      <span className="display truncate font-mono sm:hidden">
        {address.slice(0, 12)}...{address.slice(-10)}
      </span>
      <span className="hidden truncate font-mono sm:flex">{address}</span>
      <div>{copied ? <CheckIcon {...iconProps} /> : <ClipboardIcon {...iconProps} />}</div>
    </Button>
  )
}
