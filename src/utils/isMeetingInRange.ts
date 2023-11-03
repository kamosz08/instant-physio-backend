import { isAfter, isBefore, toDate } from 'date-fns'

export const isMeetingInRange = ({
  startMeeting,
  endMeeting,
  startRange,
  endRange,
}: {
  startMeeting: number
  endMeeting: number
  startRange: number
  endRange: number
}) => {
  const startMeetingDate = toDate(startMeeting)
  const endMeetingDate = toDate(endMeeting)
  const startRangeDate = toDate(startRange)
  const endRangeDate = toDate(endRange)

  const startMeetingTime = toDate(
    new Date(
      0,
      0,
      0,
      startMeetingDate.getHours(),
      startMeetingDate.getMinutes()
    )
  )
  const startRangeTime = toDate(
    new Date(0, 0, 0, startRangeDate.getHours(), startRangeDate.getMinutes())
  )
  if (isBefore(startMeetingTime, startRangeTime)) {
    return false
  }

  const endMeetingTime = toDate(
    new Date(0, 0, 0, endMeetingDate.getHours(), endMeetingDate.getMinutes())
  )
  const endRangeTime = toDate(
    new Date(0, 0, 0, endRangeDate.getHours(), endRangeDate.getMinutes())
  )
  if (isAfter(endMeetingTime, endRangeTime)) {
    return false
  }

  return true
}
