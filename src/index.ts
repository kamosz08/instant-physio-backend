import * as dotenv from 'dotenv'
dotenv.config()

import createServer from './createServer'

const PORT = 3000

const app = createServer()

app.listen(PORT, (): void => {
  console.log('Server Running!!')
})
