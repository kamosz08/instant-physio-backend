import * as dotenv from 'dotenv'
dotenv.config()

import createServer from './factories/createServer'
import { initCacheClient } from './cache'

const PORT = 8000

initCacheClient()
const app = createServer()

app.listen(PORT, (): void => {
  console.log('Server Running!!')
})
