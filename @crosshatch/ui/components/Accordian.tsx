import { Content, Header, Item, Root, Trigger } from "@radix-ui/react-accordion"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import * as React from "react"

import { cn } from "../cn.ts"

function Accordion({ className, ...props }: React.ComponentProps<typeof Root>) {
  return <Root data-slot="accordion" className={cn("flex w-full flex-col", className)} {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof Item>) {
  return <Item data-slot="accordion-item" className={cn("not-last:border-b", className)} {...props} />
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof Trigger>) {
  return (
    <Header className="flex">
      <Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </Trigger>
    </Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof Content>) {
  return (
    <Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-closed:animate-accordion-up data-open:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
