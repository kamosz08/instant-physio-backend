import {
  addDays,
  addHours,
  isBefore,
  lastDayOfMonth,
  setHours,
  setMilliseconds,
  setMinutes,
  setMonth,
  setSeconds,
} from 'date-fns'
import { getAllHoursBetween } from './getAllHoursBetween'

export const getExistingHoursForFutureMonths = (
  startDate: Date,
  numOfMonths: number,
  startWork: Date,
  endWork: Date
) => {
  let now = startDate
  now = setHours(now, now.getHours() + 1)
  now = setMinutes(now, 0)
  now = setSeconds(now, 0)
  now = setMilliseconds(now, 0)

  let result: Date[] = []
  let lastDay = lastDayOfMonth(setMonth(now, now.getMonth() + numOfMonths))
  lastDay = setHours(lastDay, 23)

  let startOfWork = setHours(now, startWork.getHours())
  let endOfWork = setHours(now, endWork.getHours())
  while (isBefore(now, lastDay)) {
    const beggingingDate = isBefore(startOfWork, now) ? now : startOfWork
    result = [
      ...result,
      beggingingDate,
      ...getAllHoursBetween(beggingingDate, endOfWork),
    ]

    now = addDays(now, 1)
    now = setHours(now, 0)
    startOfWork = setHours(now, startWork.getHours())
    endOfWork = setHours(now, endWork.getHours())
  }

  return result
}
