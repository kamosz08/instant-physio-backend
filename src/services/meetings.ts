import { db } from '../db'
import { Meeting, MeetingParticipation, User } from '../types/db'
import { isMeetingDateValid } from '../utils/isMeetingDateValid'
import { isMeetingInRange } from '../utils/isMeetingInRange'
import { isMeetingOverlapping } from '../utils/isMeetingOverlapping'
import { usersService } from './users'

// const getAll = () => db<Meeting>('meeting')

// const get = async (id) => {
//   const recipes = await getAll();
//   return recipes.find((recipe) => recipe.id === parseInt(id));
// };

const getUserMeetings = (userId: number) => {
  return db<MeetingParticipation>('meeting_participation')
    .where('user_id', userId)
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
  const { start_work, end_work } =
    await usersService.findByIdWithSpecialistFields({ id: userId })

  if (
    !isMeetingInRange({
      startMeeting,
      endMeeting,
      startRange: new Date(start_work).getTime(),
      endRange: new Date(end_work).getTime(),
    })
  ) {
    throw new Error('Meeting does not fit into working hours')
  }
}

const verifyNoAnotherMeeting = async (
  userId: number,
  newMeetingStart: number,
  newMeetingEnd: number
) => {
  const userMeetings = await getUserMeetings(userId)

  userMeetings.forEach((meeting) => {
    if (
      isMeetingOverlapping({
        startMeeting: new Date(meeting.start_time).getTime(),
        endMeeting: new Date(meeting.end_time).getTime(),
        startNewMeeting: newMeetingStart,
        endNewMeeting: newMeetingEnd,
      })
    ) {
      throw new Error('Meeting overlaps with already booked')
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
    throw new Error('Meeting time is not valid')
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
    throw new Error('Invited user does not exist')
  }

  await verifyMeetingTime({
    creatorUser,
    invitedUser,
    newMeetingStart: new Date(meeting.start_time).getTime(),
    newMeetingEnd: new Date(meeting.end_time).getTime(),
  })

  await db.transaction(async (trx) => {
    const newMeeting = await db<Meeting>('meeting')
      .insert(meeting, 'id')
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
  })
}

export const meetingsService = {
  //   getAll,
  createMeetingTwoUsers,
}
