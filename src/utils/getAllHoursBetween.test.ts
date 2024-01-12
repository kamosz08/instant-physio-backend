import { describe, expect, test } from '@jest/globals'
import { getAllHoursBetween } from './getAllHoursBetween'

describe('getAllHoursBetween util', () => {
  test('given values are even hours', () => {
    const startDate = new Date(2024, 10, 10, 8, 0, 0)
    const endDate = new Date(2024, 10, 10, 10, 0, 0)

    const result = getAllHoursBetween(startDate, endDate)

    expect(result.length).toBe(1)
    expect(result.map((d) => d.toString())).toContain(
      new Date(2024, 10, 10, 9, 0, 0).toString()
    )
  })

  test('given values are not even hours', () => {
    const startDate = new Date(2024, 10, 10, 8, 30, 0)
    const endDate = new Date(2024, 10, 10, 10, 30, 0)

    const result = getAllHoursBetween(startDate, endDate)

    expect(result.length).toBe(1)
    expect(result.map((d) => d.toString())).toContain(
      new Date(2024, 10, 10, 9, 0, 0).toString()
    )
  })
})
