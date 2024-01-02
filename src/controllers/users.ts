import { ValidationError, validate } from 'class-validator'
import { RequestHandler } from 'express'
import { usersService } from '../services/users'
import { Specialist, User } from '../types/db'
import {
  AssignSpecializationAPI,
  SpecialistCreateAPI,
  UserApproveAPI,
  UserCreateAPI,
  UserLoginAPI,
} from '../types/models/user'
import { ErrorWithStatus } from '../middlewares/errorHandler'
import { getFilePath } from '../factories/createStorage'
import { getCache } from '../cache'
import { specializationsService } from '../services/specializations'

const getNewUserStatus = (type: User['type']): User['status'] => {
  if (type === 'user') return 'active'
  return 'waiting_approval'
}

const validateUser = async (payload: Omit<User, 'id' | 'status'>) => {
  const userNew = new UserCreateAPI()
  userNew.name = payload.name
  userNew.username = payload.username
  userNew.password = payload.password
  userNew.type = payload.type
  userNew.avatar = payload.avatar
  userNew.status = getNewUserStatus(payload.type)
  userNew.gender = payload.gender

  const errors = await validate(userNew)

  return { errors, userNew }
}

const validateSpecialist = async (
  payload: Omit<Specialist & User, 'id' | 'status'>
) => {
  const userNew = new SpecialistCreateAPI()
  userNew.name = payload.name
  userNew.username = payload.username
  userNew.password = payload.password
  userNew.type = 'specialist'
  userNew.status = getNewUserStatus(payload.type)
  userNew.description = payload.description
  userNew.start_work = payload.start_work
  userNew.end_work = payload.end_work
  userNew.avatar = payload.avatar
  userNew.gender = payload.gender

  const errors = await validate(userNew)

  return { errors, userNew }
}

const validateBasedOnType = async (
  payload: Omit<Specialist & User, 'id' | 'status'>
): Promise<{
  errors: ValidationError[]
  userNew: SpecialistCreateAPI | UserCreateAPI
}> => {
  switch (payload.type) {
    case 'user':
      return await validateUser(payload)
    case 'specialist':
      return await validateSpecialist(payload)
    default:
      throw new Error('Unhandled user type!')
  }
}

const handleSignup: RequestHandler = async (req, res, next) => {
  try {
    const file = req.file
    const {
      name,
      username,
      password,
      gender,
      type,
      description = null,
      start_work = null,
      end_work = null,
    } = req.body

    let fileUrl = null
    if (file) {
      fileUrl = file.destination || getFilePath(file.originalname)
    }

    const { errors, userNew } = await validateBasedOnType({
      name,
      username,
      password,
      type,
      description,
      start_work,
      end_work,
      avatar: fileUrl,
      gender,
    })

    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }
    const user = await usersService.find({ username })

    if (user) {
      throw new Error('Email already exists!')
    }
    // Create a token for the user
    const { token } = await usersService.create(userNew)

    // Send a token to the client when a user signs up
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const userLoginInput = new UserLoginAPI()
    userLoginInput.username = username
    userLoginInput.password = password

    const errors = await validate(userLoginInput)
    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }
    const user = await usersService.find({ username })

    if (!user) {
      throw new ErrorWithStatus('There is no user with given username', 400)
    }

    // Create a token for the user, if successfully authenticated
    const { token } = await usersService.authenticate({ username, password })
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

const approve: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.body
    const userApproveInput = new UserApproveAPI()
    userApproveInput.id = id

    const errors = await validate(userApproveInput)
    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }

    const specialistToApprove = await usersService.findById({ id })

    if (!specialistToApprove) {
      const err = new ErrorWithStatus('User not found', 404)
      throw err
    }

    if (specialistToApprove.type !== 'specialist') {
      const err = new ErrorWithStatus('User is not a specialist', 400)
      throw err
    }

    await usersService.update({ id }, { status: 'active' })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const cached = await getCache().get('users')
    // if (cached) {
    //   console.log('FROM CACHE')
    //   const data = JSON.parse(cached)
    //   res.json({ data: data })
    //   return
    // }

    const data = await usersService.getAll()
    await getCache().set('users', JSON.stringify(data), {
      EX: 180,
      NX: true,
    })
    res.json({ data: data })
  } catch (error) {
    next(error)
  }
}

const getMe: RequestHandler = async (req, res, next) => {
  try {
    const authenticatedUser = req.user as User
    authenticatedUser.password = undefined

    res.json({ data: authenticatedUser })
  } catch (error) {
    next(error)
  }
}

const getSpecialists: RequestHandler = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = '',
      specialization: specializationIds,
      gender,
      available,
    } = req.query

    const availableFrom =
      typeof (available as any)?.from === 'string'
        ? new Date((available as any)?.from)
        : null
    const availableTo =
      typeof (available as any)?.to === 'string'
        ? new Date((available as any)?.to)
        : null

    const data = await usersService.getSpecialists({
      page: +page,
      limit: +limit,
      search: search.toString(),
      filters: {
        specialization:
          specializationIds && typeof specializationIds === 'string'
            ? specializationIds.split(',').map((s) => +s)
            : null,
        gender: gender && typeof gender === 'string' ? gender.split(',') : null,
        availableFrom: availableFrom,
        availableTo: availableTo,
      },
    })
    res.json(data)
  } catch (error) {
    next(error)
  }
}

const getSpecialist: RequestHandler = async (req, res, next) => {
  try {
    const specialistId = Number(req.params.specialistId)
    if (!req.params.specialistId || Number.isNaN(specialistId)) {
      throw new ErrorWithStatus('Wrong specialist id', 400)
    }

    res.json({
      data: await usersService.getSpecialist({ id: specialistId }),
    })
  } catch (error) {
    next(error)
  }
}

const getUserSpecializations: RequestHandler = async (req, res, next) => {
  try {
    const specialistId = Number(req.params.specialistId)
    if (!req.params.specialistId || Number.isNaN(specialistId)) {
      throw new ErrorWithStatus('Wrong specialist id', 400)
    }

    res.json({
      data: await usersService.getUserSpecializations({ id: specialistId }),
    })
  } catch (error) {
    next(error)
  }
}

const getUserMeetings: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId)
    if (!req.params.userId || Number.isNaN(userId)) {
      throw new ErrorWithStatus('Wrong user id', 400)
    }

    const authenticatedUser = req.user as User
    const { id: authenticatedUserId } = authenticatedUser

    res.json({
      data: await usersService.getUserMeetings({ userId, authenticatedUserId }),
    })
  } catch (error) {
    next(error)
  }
}

const assignSpecialization: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId)
    if (!req.params.userId || Number.isNaN(userId)) {
      throw new ErrorWithStatus('Wrong user id', 400)
    }

    const { id } = req.body
    const assignSpecializationInput = new AssignSpecializationAPI()
    assignSpecializationInput.specialization_id = +id
    assignSpecializationInput.user_id = userId

    const errors = await validate(assignSpecializationInput)
    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }

    await usersService.assignSpecialization({ userId, specializationId: +id })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export const usersController = {
  handleSignup,
  handleLogin,
  approve,
  getAll,
  getMe,
  getSpecialists,
  getUserMeetings,
  assignSpecialization,
  getSpecialist,
  getUserSpecializations,
}
