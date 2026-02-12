import { migrations } from "@crosshatch/store/migrations"
import { worker } from "@crosshatch/store/worker"

worker({
  key: "chat",
  migrations,
})
