import { db } from '../db'
import { ErrorWithStatus } from '../middlewares/errorHandler'
import { Meeting, MeetingParticipation, User } from '../types/db'
import { isMeetingDateValid } from '../utils/isMeetingDateValid'
import { isMeetingInRange } from '../utils/isMeetingInRange'
import { isMeetingOverlapping } from '../utils/isMeetingOverlapping'
import { usersService } from './users'
import { formatDateToDB } from '../utils/formatDateToDB'

const getUserUpcomingMeetings = async (userId: number) => {
  const meetings = await db<MeetingParticipation>('meeting_participation')
    .where('user_id', userId)
    .leftJoin<Meeting>(
      'meeting',
      'meeting_participation.meeting_id',
      'meeting.id'
    )
    .whereRaw('end_time >= ?', [formatDateToDB(new Date())])
    .select('id', 'status', 'start_time', 'creator_id')
    .orderBy('start_time', 'asc')

  return await Promise.all(
    meetings.map(async (meeting) => ({
      ...meeting,
      participants: await db<MeetingParticipation>('meeting_participation')
        .where('meeting_id', meeting.id)
        .leftJoin<User>('user', 'meeting_participation.user_id', 'user.id')
        .select('avatar', 'id', 'name'),
    }))
  )
}

const getUserHistoryMeetings = async (userId: number) => {
  const meetings = await db<MeetingParticipation>('meeting_participation')
    .where('user_id', userId)
    .leftJoin<Meeting>(
      'meeting',
      'meeting_participation.meeting_id',
      'meeting.id'
    )
    .whereRaw('end_time < ?', [formatDateToDB(new Date())])
    .select('id', 'status', 'start_time', 'creator_id')
    .orderBy('start_time', 'desc')

  return await Promise.all(
    meetings.map(async (meeting) => ({
      ...meeting,
      participants: await db<MeetingParticipation>('meeting_participation')
        .where('meeting_id', meeting.id)
        .leftJoin<User>('user', 'meeting_participation.user_id', 'user.id')
        .select('avatar', 'id', 'name'),
    }))
  )
}

const getUserAcceptedMeetings = (userId: number) => {
  return db<MeetingParticipation>('meeting_participation')
    .where('user_id', userId)
    .where('status', 'accepted')
    .leftJoin<Meeting>(
      'meeting',
      'meeting_participation.meeting_id',
      'meeting.id'
    )
}

const updateMeetingStatus = (
  meetingId: number,
  status: MeetingParticipation['status']
) => {
  return db<MeetingParticipation>('meeting_participation')
    .where('meeting_id', meetingId)
    .update('status', status)
}

const isUserPartOfMeeting = async ({
  meetingId,
  userId,
}: {
  meetingId: number
  userId: number
}) => {
  const meetingParticipation = await db<MeetingParticipation>(
    'meeting_participation'
  )
    .where('meeting_id', meetingId)
    .where('user_id', userId)
    .first()

  if (meetingParticipation) return true
  return false
}

const verifyWorkingHours = async (
  userId: number,
  startMeeting: number,
  endMeeting: number
) => {
  const { start_work, end_work } = await usersService.getSpecialist({
    id: userId,
  })

  if (
    !isMeetingInRange({
      startMeeting,
      endMeeting,
      startRange: new Date(start_work).getTime(),
      endRange: new Date(end_work).getTime(),
    })
  ) {
    throw new ErrorWithStatus('Meeting does not fit into working hours', 400)
  }
}

const verifyNoAnotherMeeting = async (
  userId: number,
  newMeetingStart: number,
  newMeetingEnd: number,
  isCreator = false
) => {
  const userMeetings = await getUserAcceptedMeetings(userId)

  userMeetings.forEach((meeting) => {
    if (
      isMeetingOverlapping({
        startMeeting: new Date(meeting.start_time).getTime(),
        endMeeting: new Date(meeting.end_time).getTime(),
        startNewMeeting: newMeetingStart,
        endNewMeeting: newMeetingEnd,
      })
    ) {
      if (isCreator) {
        throw new ErrorWithStatus(
          'You already have another meeting at this time',
          400
        )
      }
      throw new ErrorWithStatus('Meeting overlaps with another meeting', 400)
    }
  })
}

const verifyMeetingTime = async ({
  invitedUser,
  creatorUser,
  newMeetingEnd,
  newMeetingStart,
}: {
  invitedUser: User
  creatorUser: User
  newMeetingStart: number
  newMeetingEnd: number
}) => {
  if (
    !isMeetingDateValid({
      startMeeting: newMeetingStart,
      endMeeting: newMeetingEnd,
    })
  ) {
    throw new ErrorWithStatus('Meeting time is not valid', 400)
  }

  if (invitedUser.type === 'specialist') {
    await verifyWorkingHours(invitedUser.id, newMeetingStart, newMeetingEnd)
  }
  if (creatorUser.type === 'specialist') {
    await verifyWorkingHours(creatorUser.id, newMeetingStart, newMeetingEnd)
  }

  await verifyNoAnotherMeeting(invitedUser.id, newMeetingStart, newMeetingEnd)
  await verifyNoAnotherMeeting(
    creatorUser.id,
    newMeetingStart,
    newMeetingEnd,
    true
  )
}

const createMeetingTwoUsers = async (
  meeting: Omit<Meeting, 'id'>,
  invitedUserId: number,
  creatorUser: User
) => {
  const invitedUser = await usersService.findById({ id: invitedUserId })
  if (!invitedUser) {
    throw new ErrorWithStatus('Invited user does not exist', 400)
  }

  const hasCredits = await usersService.verifyUserCredits({
    userId: creatorUser.id,
    requiredAmount: 10,
  })
  if (!hasCredits) {
    throw new ErrorWithStatus('There is not enough credits', 500)
  }

  await verifyMeetingTime({
    creatorUser,
    invitedUser,
    newMeetingStart: new Date(meeting.start_time).getTime(),
    newMeetingEnd: new Date(meeting.end_time).getTime(),
  })

  const meeingToDb = {
    ...meeting,
    start_time: formatDateToDB(new Date(meeting.start_time)),
    end_time: formatDateToDB(new Date(meeting.end_time)),
  }

  await db.transaction(async (trx) => {
    const newMeeting = await db<Meeting>('meeting')
      .insert(meeingToDb, 'id')
      .transacting(trx)
    const newMeetingId = newMeeting[0] as unknown as number

    await db<MeetingParticipation>('meeting_participation')
      .insert({
        user_id: meeting.creator_id,
        meeting_id: newMeetingId,
        status: 'accepted',
      })
      .transacting(trx)
    await db<MeetingParticipation>('meeting_participation')
      .insert({
        user_id: invitedUserId,
        meeting_id: newMeetingId,
        status: 'invited',
      })
      .transacting(trx)

    await usersService.subtractUserCredits({
      userId: meeting.creator_id,
      amountToSub: 10,
      trx: trx,
    })
  })
}

export const meetingsService = {
  createMeetingTwoUsers,
  getUserAcceptedMeetings,
  getUserUpcomingMeetings,
  getUserHistoryMeetings,
  updateMeetingStatus,
  isUserPartOfMeeting,
}
