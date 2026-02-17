import type { Migration } from "./Migration.ts"

declare module "@/migrations" {
  const migrations: Array<typeof Migration.Type>
  export { migrations }
  export default migrations
}
