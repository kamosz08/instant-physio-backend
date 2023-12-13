import express from 'express'
import { specializationsController } from '../controllers/specializations'
import { authenticate, authorize } from '../middlewares/auth'
const specializationsRouter = express.Router()

specializationsRouter.get('/', specializationsController.getAll)
specializationsRouter.post(
  '/',
  authenticate(),
  authorize('specialist'),
  specializationsController.save
)

export default specializationsRouter
