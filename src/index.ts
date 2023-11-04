import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
// import { db } from './db'
import { initialize } from './middlewares/auth'
import usersRouter from './routers/users'
import specializationsRouter from './routers/specializations'
import { logger } from './middlewares/logger'
import { errorHandler } from './middlewares/errorHandler'
import meetingsRouter from './routers/meetings'

const PORT = 3000

const app = express()

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(logger)
app.use(initialize())

//Routes
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/specializations', specializationsRouter)
app.use('/api/v1/meetings', meetingsRouter)

app.use(errorHandler)

app.listen(PORT, (): void => {
  console.log('Server Running!!')
})
