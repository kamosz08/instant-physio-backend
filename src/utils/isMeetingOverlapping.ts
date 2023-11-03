import { areIntervalsOverlapping, toDate } from 'date-fns'

export const isMeetingOverlapping = ({
  endMeeting,
  startMeeting,
  startNewMeeting,
  endNewMeeting,
}: {
  endMeeting: number
  startMeeting: number
  startNewMeeting: number
  endNewMeeting: number
}) => {
  const endMeetingDate = toDate(endMeeting)
  const startMeetingDate = toDate(startMeeting)
  const endNewMeetingDate = toDate(endNewMeeting)
  const startNewMeetingDate = toDate(startNewMeeting)

  return areIntervalsOverlapping(
    { start: startMeetingDate, end: endMeetingDate },
    { start: startNewMeetingDate, end: endNewMeetingDate }
  )
}
