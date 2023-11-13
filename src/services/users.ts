import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import { Specialist, User } from '../types/db'
import { SpecialistCreateAPI, UserCreateAPI } from '../types/models/user'
import { ErrorWithStatus } from '../middlewares/errorHandler'
import { meetingsService } from './meetings'

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
    throw new ErrorWithStatus('Invalid password', 400)
  }

  const isActive = user.status === 'active'

  if (!isActive) {
    throw new ErrorWithStatus('This account is not active', 400)
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
  avatar,
}: Omit<User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    email,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
    avatar,
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
  avatar,
}: Omit<Specialist & User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    email,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
    avatar,
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

const findById = async ({ id }: { id: number }) => {
  return db<User>('user').where('id', id).first()
}

const findByIdWithSpecialistFields = async ({ id }: { id: number }) => {
  return db<User>('user')
    .where('user.id', id)
    .leftJoin<Specialist>('specialist', 'user.id', 'specialist.id')
    .first()
}

const update = async ({ id }: { id: number }, values: Partial<User>) => {
  return db<User>('user').where('id', id).update(values)
}

const getAll = () => db<User>('user')

const getSpecialists = () => db<User>('user').where('type', 'specialist')

const getUserMeetings = async ({
  userId,
  authenticatedUserId,
}: {
  userId: number
  authenticatedUserId: number
}) => {
  const user = await findById({ id: userId })

  if (!user) {
    const err = new ErrorWithStatus('User not found', 404)
    throw err
  }
  if (user.type !== 'specialist' && userId !== authenticatedUserId) {
    const err = new ErrorWithStatus('Operation not allowed', 403)
    throw err
  }

  return await meetingsService.getUserMeetings(userId)
}

export const usersService = {
  authenticate,
  create,
  find,
  findById,
  findByIdWithSpecialistFields,
  update,
  getAll,
  getSpecialists,
  getUserMeetings,
}
