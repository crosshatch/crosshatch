import { cn } from "../cn"
import { useCopy } from "../hooks/use-copy"
import { Button } from "./button"

export const AddressButton = ({
  address,
  className,
}: {
  address: string
  className?: string | undefined
}) => {
  const { copy, icon } = useCopy(address)
  return (
    <Button
      className={cn(
        "flex-row flex justify-between flex-1 w-full font-mono",
        className,
      )}
      variant="outline"
      onClick={copy}
    >
      {address}
      {icon}
    </Button>
  )
}
