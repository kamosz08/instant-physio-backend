import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'

describe('get specialist available hours', () => {
  it('should return a 200 status and data', async () => {
    const app = createServer()

    const { statusCode, body } = await supertest(app).get(
      '/api/v1/users/5/availableHours'
    )

    expect(statusCode).toBe(200)
    expect(body).toEqual({
      data: expect.any(Object),
    })
  })
})
