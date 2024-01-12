import { describe, expect, test } from '@jest/globals'
import { getExistingHoursForFutureMonths } from './getExistingHoursForFutureMonths'

describe('getExistingHoursForFutureMonths util', () => {
  test('given 3 months', () => {
    const startDate = new Date(2024, 10, 20, 8, 0, 0)

    const startWorkDate = new Date(2024, 10, 10, 8, 0, 0)
    const endWorkDate = new Date(2024, 10, 10, 9, 0, 0)
    const result = getExistingHoursForFutureMonths(
      startDate,
      0,
      startWorkDate,
      endWorkDate
    )

    expect(result.length).toBe(11)
  })
})
