import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import { Specialist, User } from '../types/db'
import { SpecialistCreateAPI, UserCreateAPI } from '../types/models/user'

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

  const isActive = user.status === 'active'

  if (!isActive) {
    throw new Error('This account is not active')
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: 24 * 60 * 60,
  })

  return { token }
}

const create = (payload: UserCreateAPI | SpecialistCreateAPI) => {
  switch (payload.type) {
    case 'user':
      return createUser(payload as UserCreateAPI)

    case 'specialist':
      return createSpecialist(payload as SpecialistCreateAPI)

    default:
      throw new Error('Unhandled user type!')
  }
}

const createUser = async ({
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

const createSpecialist = async ({
  email,
  name,
  password,
  type,
  status,
  description,
  start_work,
  end_work,
}: Omit<Specialist & User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    email,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
  }

  const createdUserId = await db.transaction(async (trx) => {
    const user = await db<User>('user').insert(newUser, 'id').transacting(trx)
    const newUserId = user[0] as unknown as number
    const newSpecialist: Specialist = {
      description,
      start_work,
      end_work,
      id: newUserId,
    }
    await db<Specialist>('specialist').insert(newSpecialist).transacting(trx)

    return newUserId
  })

  const token = jwt.sign(
    { id: createdUserId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 24 * 60 * 60,
    }
  )

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

const getSpecialists = () => db<User>('user').where('type', 'specialist')

export const usersService = {
  authenticate,
  create,
  find,
  findById,
  update,
  getAll,
  getSpecialists,
}
