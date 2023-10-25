import { validate } from 'class-validator'
import { RequestHandler } from 'express'
import { usersService } from '../services/users'
import { User } from '../types/db'
import {
  UserApproveAPI,
  UserCreateAPI,
  UserLoginAPI,
} from '../types/models/user'

const getNewUserStatus = (type: User['type']): User['status'] => {
  if (type === 'user') return 'active'
  return 'waiting_approval'
}

const handleSignup: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, type, description = null } = req.body

    const userNew = new UserCreateAPI()
    userNew.name = name
    userNew.email = email
    userNew.description = description
    userNew.password = password
    userNew.type = type
    userNew.status = getNewUserStatus(type)

    const errors = await validate(userNew)
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
