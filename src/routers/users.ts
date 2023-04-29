import express from 'express'
import { usersController } from '../controllers/users'
import { authenticate, authorize } from '../middlewares/auth'
const usersRouter = express.Router()

usersRouter.post('/signup', usersController.handleSignup)
usersRouter.post('/login', usersController.handleLogin)
usersRouter.get('/', authenticate(), usersController.getAll)
usersRouter.post(
  '/approve',
  authenticate(),
  authorize('admin'),
  usersController.handleApprove
)

export default usersRouter
