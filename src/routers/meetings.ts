import express from 'express'
import { meetingsController } from '../controllers/meetings'
import { authenticate } from '../middlewares/auth'
const meetingsRouter = express.Router()

meetingsRouter.post('/', authenticate(), meetingsController.save)

export default meetingsRouter
