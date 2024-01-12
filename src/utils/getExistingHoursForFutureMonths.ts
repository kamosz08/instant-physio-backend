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
  now = setMinutes(now, 0)
  now = setSeconds(now, 0)
  now = setMilliseconds(now, 0)
  let result: Date[] = []
  let lastDay = lastDayOfMonth(setMonth(now, now.getMonth() + numOfMonths))
  lastDay = setHours(lastDay, 23)

  let startOfWork = setHours(now, startWork.getHours())
  let endOfWork = setHours(now, endWork.getHours())
  while (isBefore(now, lastDay)) {
    now = addDays(now, 1)
    result = [
      ...result,
      startOfWork,
      ...getAllHoursBetween(startOfWork, endOfWork),
    ]
    startOfWork = setHours(now, startWork.getHours())
    endOfWork = setHours(now, endWork.getHours())
  }

  return result
}
