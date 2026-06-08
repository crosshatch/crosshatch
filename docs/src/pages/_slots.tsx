export const Footer = () => (
  <div className="vocs:flex vocs:flex-wrap vocs:items-center vocs:justify-between vocs:gap-3 vocs:border-t vocs:border-primary vocs:pt-6 vocs:text-sm vocs:text-secondary">
    <span>© Crosshatch</span>
    <nav aria-label="Business links" className="vocs:flex vocs:flex-wrap vocs:gap-x-4 vocs:gap-y-2">
      <a className="vocs:hover:text-heading" href="/terms">
        Terms of Use
      </a>
      <a className="vocs:hover:text-heading" href="/privacy">
        Privacy Policy
      </a>
      <a className="vocs:hover:text-heading" href="mailto:hello@crosshatch.dev">
        hello@crosshatch.dev
      </a>
    </nav>
  </div>
)
