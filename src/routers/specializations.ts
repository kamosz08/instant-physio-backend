import express from 'express'
import { specializationsController } from '../controllers/specializations'
import { authenticate, authorize } from '../middlewares/auth'
const specializationsRouter = express.Router()

// specializationsRouter.get(
//   '/',
//   authorize,
//   specializationsController.getAll
// )
specializationsRouter.get('/', specializationsController.getAll) //TODO: uncomment above and delete this line
specializationsRouter.post(
  '/',
  authenticate(),
  authorize('specialist'),
  specializationsController.save
)

export default specializationsRouter
