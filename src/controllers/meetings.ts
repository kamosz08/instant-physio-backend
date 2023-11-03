import { validate } from 'class-validator'
import { RequestHandler } from 'express'
import { meetingsService } from '../services/meetings'
import { Meeting, User } from '../types/db'
import { MeetingCreateAPI } from '../types/models/meeting'

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

export const meetingsController = {
  save,
}
