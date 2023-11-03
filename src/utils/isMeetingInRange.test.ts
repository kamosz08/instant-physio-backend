import { describe, expect, test } from '@jest/globals'
import { isMeetingInRange } from './isMeetingInRange'

describe('isMeetingInRange util', () => {
  test('starts in the middle of range', () => {
    const startMeeting = new Date(2020, 0, 12, 9, 0).getTime()
    const startRange = new Date(2020, 0, 12, 8, 0).getTime()
    const endMeeting = new Date(2020, 0, 12, 10, 0).getTime()
    const endRange = new Date(2020, 0, 12, 16, 0).getTime()
    expect(
      isMeetingInRange({ startMeeting, endMeeting, startRange, endRange })
    ).toBe(true)
  })

  test('starts at the beginnging of range', () => {
    const startMeeting = new Date(2020, 0, 12, 8, 0).getTime()
    const startRange = new Date(2020, 0, 12, 8, 0).getTime()
    const endMeeting = new Date(2020, 0, 12, 9, 0).getTime()
    const endRange = new Date(2020, 0, 12, 16, 0).getTime()
    expect(
      isMeetingInRange({ startMeeting, endMeeting, startRange, endRange })
    ).toBe(true)
  })

  test('ends at the end of range', () => {
    const startMeeting = new Date(2020, 0, 12, 15, 0).getTime()
    const startRange = new Date(2020, 0, 12, 8, 0).getTime()
    const endMeeting = new Date(2020, 0, 12, 16, 0).getTime()
    const endRange = new Date(2020, 0, 12, 16, 0).getTime()
    expect(
      isMeetingInRange({ startMeeting, endMeeting, startRange, endRange })
    ).toBe(true)
  })

  test('ends after end of range', () => {
    const startMeeting = new Date(2020, 0, 12, 15, 0).getTime()
    const startRange = new Date(2020, 0, 12, 8, 0).getTime()
    const endMeeting = new Date(2020, 0, 12, 16, 30).getTime()
    const endRange = new Date(2020, 0, 12, 16, 0).getTime()
    expect(
      isMeetingInRange({ startMeeting, endMeeting, startRange, endRange })
    ).toBe(false)
  })

  test('starts before start of range', () => {
    const startMeeting = new Date(2020, 0, 12, 8, 0).getTime()
    const startRange = new Date(2020, 0, 12, 9, 0).getTime()
    const endMeeting = new Date(2020, 0, 12, 9, 0).getTime()
    const endRange = new Date(2020, 0, 12, 17, 0).getTime()
    expect(
      isMeetingInRange({ startMeeting, endMeeting, startRange, endRange })
    ).toBe(false)
  })

  test('make sure only time is considered', () => {
    const startMeeting = new Date(2022, 2, 12, 8, 0).getTime()
    const startRange = new Date(2020, 0, 12, 8, 0).getTime()
    const endMeeting = new Date(2022, 2, 12, 9, 0).getTime()
    const endRange = new Date(2020, 0, 12, 17, 0).getTime()
    expect(
      isMeetingInRange({ startMeeting, endMeeting, startRange, endRange })
    ).toBe(true)
  })
})
