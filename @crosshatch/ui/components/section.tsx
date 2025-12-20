import { cn } from "../cn"

export const Section = ({ className, ...rest }: React.ComponentProps<"div">) => (
  <div className={cn("flex w-full", className)} {...rest} />
)

export const SectionInner = ({ className, ...rest }: React.ComponentProps<"div">) => (
  <div className={cn("relative flex w-full max-w-5xl mx-auto flex-col", className)} {...rest} />
)
