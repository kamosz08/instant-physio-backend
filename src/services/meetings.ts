import { db } from '../db'
import { ErrorWithStatus } from '../middlewares/errorHandler'
import { Meeting, MeetingParticipation, User } from '../types/db'
import { isMeetingDateValid } from '../utils/isMeetingDateValid'
import { isMeetingInRange } from '../utils/isMeetingInRange'
import { isMeetingOverlapping } from '../utils/isMeetingOverlapping'
import { usersService } from './users'
import { formatDateToDB } from '../utils/formatDateToDB'

const getUserMeetings = (userId: number) => {
  return db<MeetingParticipation>('meeting_participation')
    .where('user_id', userId)
    .leftJoin<Meeting>(
      'meeting',
      'meeting_participation.meeting_id',
      'meeting.id'
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
  newMeetingEnd: number
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
      throw new ErrorWithStatus(
        'Meeting overlaps with another user meeting',
        400
      )
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
  await verifyNoAnotherMeeting(creatorUser.id, newMeetingStart, newMeetingEnd)
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
  getUserMeetings,
}
