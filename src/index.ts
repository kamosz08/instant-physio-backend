import * as dotenv from 'dotenv'
dotenv.config()

import createServer from './factories/createServer'
import { initRedisClient } from './cache'

const PORT = 8000

initRedisClient()
const app = createServer()

app.listen(PORT, (): void => {
  console.log('Server Running!!')
})
