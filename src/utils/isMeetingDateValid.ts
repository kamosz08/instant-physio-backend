import { isAfter, isFuture, isValid, toDate } from 'date-fns'

export const isMeetingDateValid = ({
  startMeeting,
  endMeeting,
}: {
  startMeeting: number
  endMeeting: number
}) => {
  if (!isValid(startMeeting) || !isValid(endMeeting)) {
    return false
  }

  const startMeetingDate = toDate(startMeeting)
  const endMeetingDate = toDate(endMeeting)

  if (!isFuture(startMeetingDate) || !isFuture(endMeetingDate)) {
    return false
  }

  if (!isAfter(endMeetingDate, startMeetingDate)) {
    return false
  }

  return true
}
