import { RequestHandler } from 'express'
import { usersService } from '../services/users'

const handleSignup: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, type } = req.body
    const user = await usersService.find({ email })

    if (user) {
      throw new Error('Email already exists!')
    }
    // Create a token for the user
    const { token } = await usersService.create({ name, email, password, type })

    // Send a token to the client when a user signs up
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
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

export const usersController = {
  handleSignup,
  handleLogin,
}
