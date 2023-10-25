import express from 'express'
import { usersController } from '../controllers/users'
import { authenticate, authorize } from '../middlewares/auth'
const usersRouter = express.Router()

usersRouter.post('/signup', usersController.handleSignup)
usersRouter.post('/login', usersController.handleLogin)
usersRouter.get('/', authenticate(), authorize('admin'), usersController.getAll)
usersRouter.get('/specialists', authenticate(), usersController.getSpecialists)
usersRouter.post(
  '/approve',
  authenticate(),
  authorize('admin'),
  usersController.handleApprove
)

export default usersRouter
