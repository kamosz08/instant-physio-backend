import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { initialize } from '../middlewares/auth'
import usersRouter from '../routers/users'
import specializationsRouter from '../routers/specializations'
import { logger } from '../middlewares/logger'
import { errorHandler } from '../middlewares/errorHandler'
import meetingsRouter from '../routers/meetings'

const createServer = () => {
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

  //TODO: Remove temporary
  app.use('/uploads', express.static('uploads'))

  app.use(errorHandler)

  return app
}

export default createServer
