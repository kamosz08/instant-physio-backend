import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'

describe('get specialists', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app).get(
        '/api/v1/users/specialists'
      )

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated user', () => {
    it('should return a 200 status and data', async () => {
      const app = createServer()

      const token = await loginUser(app)

      const { statusCode, body } = await supertest(app)
        .get('/api/v1/users/specialists')
        .auth(token, { type: 'bearer' })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        data: expect.any(Array),
      })
    })
  })
})
