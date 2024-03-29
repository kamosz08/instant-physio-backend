import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'

describe('get all specializations', () => {
  it('should return a 200 status and data', async () => {
    const app = createServer()

    const { statusCode, body } = await supertest(app).get(
      '/api/v1/specializations/'
    )

    expect(statusCode).toBe(200)
    expect(body).toEqual({
      data: expect.any(Array),
    })
  })
})
