import express from 'express'
import { specializationsController } from '../controllers/specializations'
import { usersService } from '../services/users'
const specializationsRouter = express.Router()

specializationsRouter.get('/', specializationsController.getAll)
specializationsRouter.post(
  '/',
  // usersService.authenticate(),
  specializationsController.save
)

export default specializationsRouter
