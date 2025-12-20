import { migrations } from "@crosshatch/store/migrations"
import { worker } from "@crosshatch/store/worker"

worker("chat", migrations)
