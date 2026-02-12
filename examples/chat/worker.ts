import { migrations } from "@crosshatch/store/migrations"
import { worker } from "@crosshatch/store/worker"
import { env } from "crosshatch"

worker("chat", migrations, env.dev)
