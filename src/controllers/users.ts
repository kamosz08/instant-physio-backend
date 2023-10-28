import { ValidationError, validate } from 'class-validator'
import { RequestHandler } from 'express'
import { usersService } from '../services/users'
import { Specialist, User } from '../types/db'
import {
  SpecialistCreateAPI,
  UserApproveAPI,
  UserCreateAPI,
  UserLoginAPI,
} from '../types/models/user'

const getNewUserStatus = (type: User['type']): User['status'] => {
  if (type === 'user') return 'active'
  return 'waiting_approval'
}

const validateUser = async (payload: Omit<User, 'id' | 'status'>) => {
  const userNew = new UserCreateAPI()
  userNew.name = payload.name
  userNew.email = payload.email
  userNew.password = payload.password
  userNew.type = payload.type
  userNew.status = getNewUserStatus(payload.type)

  const errors = await validate(userNew)

  return { errors, userNew }
}

const validateSpecialist = async (
  payload: Omit<Specialist & User, 'id' | 'status'>
) => {
  const userNew = new SpecialistCreateAPI()
  userNew.name = payload.name
  userNew.email = payload.email
  userNew.password = payload.password
  userNew.type = 'specialist'
  userNew.status = getNewUserStatus(payload.type)
  userNew.description = payload.description
  userNew.start_work = payload.start_work
  userNew.end_work = payload.end_work

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
    const {
      name,
      email,
      password,
      type,
      description = null,
      start_work = null,
      end_work = null,
    } = req.body

    const { errors, userNew } = await validateBasedOnType({
      name,
      email,
      password,
      type,
      description,
      start_work,
      end_work,
    })

    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }
    const user = await usersService.find({ email })

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
    const { email, password } = req.body

    const userLoginInput = new UserLoginAPI()
    userLoginInput.email = email
    userLoginInput.password = password

    const errors = await validate(userLoginInput)
    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }
    const user = await usersService.find({ email })

    if (!user) {
      throw new Error('Unable to login')
    }

    // Create a token for the user, if successfully authenticated
    const { token } = await usersService.authenticate({ email, password })
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

const handleApprove: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.body
    const userApproveInput = new UserApproveAPI()
    userApproveInput.id = id

    const errors = await validate(userApproveInput)
    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }

    await usersService.update({ id }, { status: 'active' })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

const getAll: RequestHandler = async (req, res, next) => {
  try {
    res.json({ data: await usersService.getAll() })
  } catch (error) {
    next(error)
  }
}

const getSpecialists: RequestHandler = async (req, res, next) => {
  try {
    res.json({ data: await usersService.getSpecialists() })
  } catch (error) {
    next(error)
  }
}

export const usersController = {
  handleSignup,
  handleLogin,
  handleApprove,
  getAll,
  getSpecialists,
}
