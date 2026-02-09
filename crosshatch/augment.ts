import { makeFetch } from "./makeFetch.ts"

globalThis.fetch = makeFetch(fetch)
