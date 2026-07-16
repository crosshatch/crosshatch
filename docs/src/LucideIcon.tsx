export const LucideIcon = (props: { readonly className?: string | undefined; readonly svg: string }) => (
  <span
    aria-hidden="true"
    dangerouslySetInnerHTML={{
      __html: props.className ? props.svg.replace('class="', `class="${props.className} `) : props.svg,
    }}
  />
)
