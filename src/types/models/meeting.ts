import { IsString } from 'class-validator'
import { Meeting } from '../db'

export class MeetingCreateAPI implements Omit<Meeting, 'id' | 'creator_id'> {
  @IsString()
  start_time: string

  @IsString()
  end_time: string
}
