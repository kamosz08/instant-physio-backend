import { addHours, isBefore, setMinutes } from 'date-fns'

export const getAllHoursBetween = (dateStart: Date, dateEnd: Date) => {
  const evenDateStart = setMinutes(dateStart, 0)
  const evenDateEnd = setMinutes(dateEnd, 0)

  const betweenDates: Date[] = []
  let iteratorDate = addHours(evenDateStart, 1)
  while (isBefore(iteratorDate, evenDateEnd)) {
    betweenDates.push(iteratorDate)
    iteratorDate = addHours(iteratorDate, 1)
  }
  return betweenDates
}
