---
"@crosshatch/widget": patch
---

Refactor Widget and Launcher abstractions, with dedicated iframe and popup
launchers and improved payload, result, and error handling. It consolidates the
Ramp API and client into Cirque, introduces reusable stage/domain configuration,
and moves deployment utilities into @crosshatch/alchemy. It also expands the
crypto toolkit with HTTP message signing and verification, hashing helpers, and
more consistent key types and branding.
