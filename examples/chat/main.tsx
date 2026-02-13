/// <reference types="vite/client" />
import { RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { router } from "./router"
import "@/app.css"
import "@crosshatch/ui/prelude"

ReactDOM.createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RouterProvider {...{ router }} />
  </StrictMode>,
)
