import * as dotenv from 'dotenv'
dotenv.config()

import createServer from './factories/createServer'

const PORT = 3000

const app = createServer()

app.listen(PORT, (): void => {
  console.log('Server Running!!')
})
