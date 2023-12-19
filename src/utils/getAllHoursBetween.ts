import { addHours, isBefore } from 'date-fns'

export const getAllHoursBetween = (dateStart: Date, dateEnd: Date) => {
  const betweenDates = []
  let interatorDate = addHours(dateStart, 1)
  while (isBefore(interatorDate, dateEnd)) {
    betweenDates.push(interatorDate)
    interatorDate = addHours(interatorDate, 1)
  }
  return betweenDates
}
