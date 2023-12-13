import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import {
  Specialist,
  Specialization,
  User,
  UserSpecialization,
} from '../types/db'
import { SpecialistCreateAPI, UserCreateAPI } from '../types/models/user'
import { ErrorWithStatus } from '../middlewares/errorHandler'
import { meetingsService } from './meetings'
import { RichData, RichDataParams } from '../types/richData'

const authenticate = async ({
  username,
  password,
}: Pick<User, 'username' | 'password'>) => {
  const user = await find({ username })
  if (!user) {
    throw new Error('User with this username cannot be found')
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
  username,
  name,
  password,
  type,
  status,
  avatar,
  gender,
}: Omit<User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    username,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
    avatar,
    gender,
  }

  const user = await db<User>('user').insert(newUser, ['id'])

  const token = jwt.sign({ id: user[0] }, process.env.JWT_SECRET as string, {
    expiresIn: 24 * 60 * 60,
  })

  return { token }
}

const createSpecialist = async ({
  username,
  name,
  gender,
  password,
  type,
  status,
  description,
  start_work,
  end_work,
  avatar,
}: Omit<Specialist & User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    username,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
    avatar,
    gender,
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

const find = async ({ username }: { username: string }) => {
  return db<User>('user').where('username', username).first()
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

const getSpecialists = async ({
  page,
  limit,
  filters,
  search,
}: RichDataParams<{
  specialization: number[] | null
  gender: string[] | null
}>): Promise<RichData> => {
  const data = await db<User>('user')
    .leftJoin<Specialist>('specialist', 'user.id', 'specialist.id')
    .select('user.id', 'name', 'username', 'avatar', 'gender', 'description')
    .where('type', 'specialist')
    .where('status', 'active')
    .modify((queryBuilder) => {
      if (search) {
        queryBuilder.where(
          db.raw("CONCAT(name, username, COALESCE(description, '')) LIKE ?", [
            `%${search}%`,
          ])
        )
      }
      if (filters.gender) {
        queryBuilder.whereIn('gender', filters.gender)
      }
      if (filters.specialization) {
        queryBuilder
          .leftJoin(
            'user_specialization',
            'user.id',
            'user_specialization.user_id'
          )
          .whereIn(
            'user_specialization.specialization_id',
            filters.specialization
          )
      }
    })
    .limit(limit + 1)
    .offset((page - 1) * limit)

  return {
    data: data.length > limit ? data.slice(0, -1) : data,
    limit,
    page,
    isLast: data.length < limit + 1,
  }
}

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

const assignSpecialization = async ({
  userId,
  specializationId,
}: {
  userId: number
  specializationId: number
}) => {
  const user = await findById({ id: userId })

  if (!user) {
    const err = new ErrorWithStatus('User not found', 404)
    throw err
  }

  const specialization = await db<Specialization>('specialization')
    .where('id', specializationId)
    .first()

  if (!specialization) {
    const err = new ErrorWithStatus('Specialization not found', 404)
    throw err
  }

  await db<UserSpecialization>('user_specialization').insert({
    user_id: userId,
    specialization_id: specializationId,
  })
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
  assignSpecialization,
}
