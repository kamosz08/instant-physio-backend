import express from 'express'
import { specializationsController } from '../controllers/specializations'
import { authenticate } from '../middlewares/auth'
const specializationsRouter = express.Router()

specializationsRouter.get('/', specializationsController.getAll)
specializationsRouter.post('/', authenticate(), specializationsController.save)

export default specializationsRouter
