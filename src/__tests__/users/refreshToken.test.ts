import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'

describe('refresh token', () => {
  it('should return a 200 status and new jwt token', async () => {
    const app = createServer()

    const { refreshToken } = await loginUser(app)
    console.log('old', refreshToken)

    const response = await supertest(app).post('/api/v1/users/token').send({
      refreshToken: refreshToken,
    })
    const { statusCode, body } = response
    const newRefreshToken = response
      .get('Set-Cookie')[0]
      .split(';')
      .find((s) => s.includes('refreshToken'))
      .split('=')[1]
    console.log('new', newRefreshToken)

    expect(statusCode).toBe(200)
    expect(typeof newRefreshToken).toBe('string')
    expect(newRefreshToken).not.toEqual(refreshToken)
    expect(body).toEqual({
      accessToken: expect.any(String),
      expireTime: expect.any(Number),
    })
  })
})
