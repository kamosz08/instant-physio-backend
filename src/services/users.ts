import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import { User } from '../types/db'

const authenticate = async ({
  email,
  password,
}: Pick<User, 'email' | 'password'>) => {
  const user = await find({ email })
  if (!user) {
    throw new Error('User with this email cannot be found')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: 24 * 60 * 60,
  })

  return { token }
}

const create = async ({
  email,
  name,
  password,
  type,
  status,
}: Omit<User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    email,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
  }

  const user = await db<User>('user').insert(newUser, ['id'])

  const token = jwt.sign({ id: user[0] }, process.env.JWT_SECRET as string, {
    expiresIn: 24 * 60 * 60,
  })

  return { token }
}

const find = async ({ email }: { email: string }) => {
  return db<User>('user').where('email', email).first()
}

const findById = async ({ id }: { id: string }) => {
  return db<User>('user').where('id', id).first()
}

const update = async ({ id }: { id: string }, values: Partial<User>) => {
  return db<User>('user').where('id', id).update(values)
}

const getAll = () => db<User>('user')

export const usersService = {
  authenticate,
  create,
  find,
  findById,
  update,
  getAll,
}
