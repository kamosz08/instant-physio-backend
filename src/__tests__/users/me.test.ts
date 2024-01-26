import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'

describe('get me', () => {
  describe('given signed in user', () => {
    it('should return a 200 status and body', async () => {
      const app = createServer()
      const { accessToken } = await loginUser(app)

      const { statusCode, body } = await supertest(app)
        .get('/api/v1/users/me')
        .auth(accessToken, { type: 'bearer' })

      expect(statusCode).toBe(200)

      expect(body).toEqual({
        data: expect.any(Object),
      })
    })
  })

  describe('given not signed in user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app).get('/api/v1/users/me')

      expect(statusCode).toBe(401)
    })
  })
})
