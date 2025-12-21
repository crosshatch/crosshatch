export const dev = true
export const domain = `crosshatch.${dev ? "local" : "dev"}`
export const url = `https://${domain}`
export const apiUrl = dev ? "http://localhost:7776" : "https://api.crosshatch.dev"
