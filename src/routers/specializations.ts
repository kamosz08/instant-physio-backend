import express from 'express'
import { specializationsController } from '../controllers/specializations'
import { authenticate, authorize } from '../middlewares/auth'
import storage from '../storage'

const specializationsRouter = express.Router()

specializationsRouter.get('/', specializationsController.getAll)
specializationsRouter.get(
  '/:specializationSlug',
  specializationsController.getSpecializationDetails
)
specializationsRouter.post(
  '/',
  authenticate(),
  authorize('specialist'),
  storage.upload.fields([
    { name: 'benefitsPhoto', maxCount: 1 },
    { name: 'mainPhoto', maxCount: 1 },
  ]),
  specializationsController.save
)

export default specializationsRouter
