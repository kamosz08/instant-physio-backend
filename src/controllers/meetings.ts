import { validate } from 'class-validator'
import { RequestHandler } from 'express'
import { meetingsService } from '../services/meetings'
import { Meeting, User } from '../types/db'
import { MeetingCreateAPI } from '../types/models/meeting'
import { ErrorWithStatus } from '../middlewares/errorHandler'

const save: RequestHandler = async (req, res, next) => {
  try {
    const creatorUser = req.user as User
    const { id: creatorId } = creatorUser

    const { invitedUserId, start_time, end_time } = req.body as Omit<
      Meeting,
      'id' | 'creator_id'
    > & { invitedUserId: number }
    const newMeeting = new MeetingCreateAPI()
    newMeeting.start_time = start_time
    newMeeting.end_time = end_time

    const errors = await validate(newMeeting)

    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }

    if (!invitedUserId) {
      throw new ErrorWithStatus('Missing invited user id', 400)
    }

    await meetingsService.createMeetingTwoUsers(
      { ...newMeeting, creator_id: creatorId },
      invitedUserId,
      creatorUser
    )

    res.status(201).json()
  } catch (error) {
    next(error)
  }
}

const updateMeetingStatus: RequestHandler = async (req, res, next) => {
  try {
    const meetingId = Number(req.params.meetingId)
    if (!req.params.meetingId || Number.isNaN(meetingId)) {
      throw new ErrorWithStatus('Wrong meeting id', 400)
    }
    const { status } = req.body
    if (!status || status !== 'canceled') {
      throw new ErrorWithStatus('Wrong request payload', 400)
    }
    const authenticatedUser = req.user as User
    authenticatedUser.password = undefined
    const isPartOfMeeting = await meetingsService.isUserPartOfMeeting({
      meetingId,
      userId: authenticatedUser.id,
    })
    if (!isPartOfMeeting) {
      throw new ErrorWithStatus(
        'You are not allowed to update meeting you are not part of',
        403
      )
    }
    await meetingsService.updateMeetingStatus(meetingId, 'canceled')

    res.status(201).json()
  } catch (error) {
    next(error)
  }
}

export const meetingsController = {
  save,
  updateMeetingStatus,
}
