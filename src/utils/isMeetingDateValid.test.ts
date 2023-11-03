import { describe, expect, test } from '@jest/globals'
import { isMeetingDateValid } from './isMeetingDateValid'

describe('isMeetingDateValid util', () => {
  test('checks if given values are valid dates', () => {
    const startMeeting = 'test' as any
    const endMeeting = '123' as any

    expect(isMeetingDateValid({ startMeeting, endMeeting })).toBe(false)
  })

  test('checks if given values are in the future', () => {
    const startMeetingPast = new Date(2020, 0, 12, 9, 0).getTime()
    const endMeetingPast = new Date(2020, 0, 12, 10, 0).getTime()

    expect(
      isMeetingDateValid({
        startMeeting: startMeetingPast,
        endMeeting: endMeetingPast,
      })
    ).toBe(false)

    const startMeeting = new Date(2040, 0, 12, 9, 0).getTime()
    const endMeeting = new Date(2040, 0, 12, 10, 0).getTime()

    expect(
      isMeetingDateValid({
        startMeeting,
        endMeeting,
      })
    ).toBe(true)
  })

  test('checks if end meeting is after start meeting', () => {
    const startMeetingWrong = new Date(2020, 0, 12, 11, 0).getTime()
    const endMeetingWrong = new Date(2020, 0, 12, 10, 0).getTime()

    expect(
      isMeetingDateValid({
        startMeeting: startMeetingWrong,
        endMeeting: endMeetingWrong,
      })
    ).toBe(false)

    const startMeeting = new Date(2040, 0, 12, 9, 0).getTime()
    const endMeeting = new Date(2040, 0, 12, 10, 0).getTime()

    expect(
      isMeetingDateValid({
        startMeeting,
        endMeeting,
      })
    ).toBe(true)
  })
})
