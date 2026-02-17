import { cn } from "../cn.ts"
import { useCopy } from "../hooks/useCopy.ts"
import { Button } from "./Button.tsx"

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
  const { copy, icon } = useCopy(address, 4)
  return (
    <Button className={cn("w-full flex-row gap-2", className)} variant="outline" onClick={copy}>
      {left}
      <span className="display truncate font-mono sm:hidden">
        {address.slice(0, 12)}...{address.slice(-10)}
      </span>
      <span className="hidden truncate font-mono sm:flex">{address}</span>
      <div>{icon}</div>
    </Button>
  )
}
