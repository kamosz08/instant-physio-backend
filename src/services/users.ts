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
import { formatDateToDB } from '../utils/formatDateToDB'
import { getAllHoursBetween } from '../utils/getAllHoursBetween'
import { getExistingHoursForFutureMonths } from '../utils/getExistingHoursForFutureMonths'
import { isEqual } from 'date-fns'

const ACCESS_EXPIRE_SECONDS = 15 * 60
const REFRESH_EXPIRE = '30 days'

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

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: ACCESS_EXPIRE_SECONDS,
    }
  )
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: REFRESH_EXPIRE }
  )

  const expireTime = Date.now() + (ACCESS_EXPIRE_SECONDS - 10) * 100

  return { accessToken, refreshToken, expireTime }
}

const generateNewToken = async ({ refreshToken }: { refreshToken: string }) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    )
    if (typeof decoded === 'string') {
      throw new ErrorWithStatus('Something went wrong', 500)
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: ACCESS_EXPIRE_SECONDS,
      }
    )
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: REFRESH_EXPIRE }
    )

    const expireTime = Date.now() + (ACCESS_EXPIRE_SECONDS - 10) * 100

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expireTime,
    }
  } catch (err) {
    console.log(err)
    throw new ErrorWithStatus('Something went wrong', 500)
  }

  // if (!refreshToken) {
  //   res.status(403).json({ message: "Refresh token is not in database!" });
  //   return;
  // }

  // if (RefreshToken.verifyExpiration(refreshToken)) {
  //   RefreshToken.destroy({ where: { id: refreshToken.id } });

  //   res.status(403).json({
  //     message: "Refresh token was expired. Please make a new signin request",
  //   });
  //   return;
  // }

  // const accessToken = jwt.sign(
  //   { id: user.id },
  //   process.env.JWT_SECRET as string,
  //   {
  //     expiresIn: ACCESS_EXPIRE_SECONDS,
  //   }
  // )
  // const refreshToken = jwt.sign(
  //   { id: user.id },
  //   process.env.JWT_REFRESH_SECRET as string
  // )
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
  credits,
}: Omit<User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    username,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
    avatar,
    gender,
    credits,
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
  credits,
}: Omit<Specialist & User, 'id'>) => {
  const newUser: Omit<User, 'id'> = {
    username,
    name,
    password: await bcrypt.hash(password, 10),
    type,
    status,
    avatar,
    gender,
    credits,
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

const getSpecialist = async ({ id }: { id: number }) => {
  return db<User>('user')
    .where('user.id', id)
    .leftJoin<Specialist>('specialist', 'user.id', 'specialist.id')
    .select(
      'avatar',
      'description',
      'end_work',
      'start_work',
      'user.id',
      'gender',
      'name',
      'username'
    )
    .first()
}

const getUserSpecializations = async ({ id }: { id: number }) => {
  return db<UserSpecialization>('user_specialization')
    .where('user_id', id)
    .leftJoin<Specialization>(
      'specialization',
      'user_specialization.specialization_id',
      'specialization.id'
    )
    .select('id', 'name', 'slug')
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
  availableFrom: Date | null
  availableTo: Date | null
}>): Promise<RichData> => {
  const data = await db<User>('user')
    .leftJoin<Specialist>('specialist', 'user.id', 'specialist.id')
    .select('user.id', 'name', 'username', 'avatar', 'gender', 'description')
    .where('type', 'specialist')
    .where('user.status', 'active')
    .modify((filterQueryBuilder) => {
      if (search) {
        filterQueryBuilder.where(
          db.raw("CONCAT(name, username, COALESCE(description, '')) LIKE ?", [
            `%${search}%`,
          ])
        )
      }
      if (filters.gender) {
        filterQueryBuilder.whereIn('gender', filters.gender)
      }
      if (filters.specialization) {
        filterQueryBuilder.whereExists(
          db('user')
            .leftJoin(
              'user_specialization',
              'user.id',
              'user_specialization.user_id'
            )
            .whereIn(
              'user_specialization.specialization_id',
              filters.specialization
            )
        )
      }
      if (filters.availableFrom && filters.availableTo) {
        const betweenDates = getAllHoursBetween(
          filters.availableFrom,
          filters.availableTo
        )
        const datesToCheck = [filters.availableFrom, ...betweenDates]
        filterQueryBuilder.where((meetingQueryBuilder) => {
          datesToCheck.forEach((date) => {
            meetingQueryBuilder.orWhere((bd) => {
              bd.whereNotExists(
                db('meeting')
                  .leftJoin(
                    'meeting_participation',
                    'meeting.id',
                    'meeting_participation.meeting_id'
                  )
                  .whereRaw('user.id = meeting_participation.user_id')
                  .where('meeting.start_time', formatDateToDB(date))
              )
                .andWhereRaw('TIME(specialist.start_work) <= TIME(?)', [
                  formatDateToDB(date),
                ])
                .andWhereRaw('TIME(specialist.end_work) > TIME(?)', [
                  formatDateToDB(date),
                ])
            })
          })
        })
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

const getSpecialistAvailableHours = async ({ userId }: { userId: number }) => {
  const specialist = await getSpecialist({ id: userId })
  if (!specialist) {
    const err = new ErrorWithStatus('User not found', 404)
    throw err
  }
  const specialistMeetings = await meetingsService.getUserMeetings(userId)

  const datesInNextMonths = getExistingHoursForFutureMonths(
    new Date(),
    2,
    specialist.start_work,
    specialist.end_work
  )

  const specialistMeetingStartTimes = specialistMeetings.map(
    (meeting) => meeting.start_time
  )
  const result = datesInNextMonths.filter(
    (d) =>
      !specialistMeetingStartTimes.find((startMeeting) =>
        isEqual(new Date(startMeeting), d)
      )
  )

  return result
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

const verifyUserCredits = async ({
  userId,
  requiredAmount,
}: {
  userId: number
  requiredAmount: number
}) => {
  const user = await findById({ id: userId })

  if (!user) {
    const err = new ErrorWithStatus('User not found', 404)
    throw err
  }

  return user.credits >= requiredAmount
}

const addUserCredits = async ({
  userId,
  amountToAdd,
}: {
  userId: number
  amountToAdd: number
}) => {
  const user = await findById({ id: userId })

  if (!user) {
    const err = new ErrorWithStatus('User not found', 404)
    throw err
  }
  await db<User>('user')
    .where('id', userId)
    .update({ credits: user.credits + amountToAdd })

  return db<User>('user').where('id', userId).first().select('credits')
}

const subtractUserCredits = async ({
  userId,
  amountToSub,
  trx,
}: {
  userId: number
  amountToSub: number
  trx: any
}) => {
  const user = await findById({ id: userId })

  if (!user) {
    const err = new ErrorWithStatus('User not found', 404)
    throw err
  }

  const newValue =
    user.credits - amountToSub < 0 ? 0 : user.credits - amountToSub

  return db<User>('user')
    .where('id', userId)
    .update({ credits: newValue })
    .transacting(trx)
}

export const usersService = {
  authenticate,
  create,
  find,
  findById,
  getSpecialist,
  getUserSpecializations,
  update,
  getAll,
  getSpecialists,
  getSpecialistAvailableHours,
  getUserMeetings,
  assignSpecialization,
  verifyUserCredits,
  addUserCredits,
  subtractUserCredits,
  generateNewToken,
}
