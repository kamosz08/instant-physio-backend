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
usersRouter.post('/token', usersController.handleRefreshToken)
usersRouter.get('/', authenticate(), authorize('admin'), usersController.getAll)
usersRouter.get('/me', authenticate(), usersController.getMe)
usersRouter.get('/specialists', usersController.getSpecialists)
usersRouter.get('/specialists/:specialistId', usersController.getSpecialist)
usersRouter.get(
  '/:specialistId/specializations',
  usersController.getUserSpecializations
)
usersRouter.get(
  '/:specialistId/availableHours',
  usersController.getSpecialistAvailableHours
)
usersRouter.get(
  '/:userId/meetings/upcoming',
  authenticate(),
  usersController.getUserUpcomingMeetings
)
usersRouter.get(
  '/:userId/meetings/history',
  authenticate(),
  usersController.getUserHistoryMeetings
)
usersRouter.post('/buyCredits', authenticate(), usersController.buyCredits)
usersRouter.post(
  '/approve',
  authenticate(),
  authorize('admin'),
  usersController.approve
)
usersRouter.post(
  '/:userId/specialization',
  authenticate(),
  authorize('admin'),
  usersController.assignSpecialization
)

export default usersRouter
