import express from 'express'
import { usersController } from '../controllers/users'
import { authenticate, authorize } from '../middlewares/auth'
import storage from '../storage'
const usersRouter = express.Router()

usersRouter.post(
  '/signup',
  storage.upload.single('avatar'),
  usersController.handleSignup
)
usersRouter.post('/login', usersController.handleLogin)
usersRouter.get('/', authenticate(), authorize('admin'), usersController.getAll)
usersRouter.get('/specialists', authenticate(), usersController.getSpecialists)
usersRouter.get(
  '/:userId/meetings',
  authenticate(),
  usersController.getUserMeetings
)
usersRouter.post(
  '/approve',
  authenticate(),
  authorize('admin'),
  usersController.handleApprove
)

export default usersRouter
