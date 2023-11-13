import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'
import { loginAdmin } from '../../testUtils/loginAdmin'

describe('get all users', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app).get('/api/v1/users/')

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated but not authorized user', () => {
    it('should return a 403 status', async () => {
      const app = createServer()

      const token = await loginUser(app)

      const { statusCode } = await supertest(app)
        .get('/api/v1/users/')
        .auth(token, { type: 'bearer' })

      expect(statusCode).toBe(403)
    })
  })

  describe('given authenticated and authorized user with admin rights', () => {
    it('should return a 200 status and data', async () => {
      const app = createServer()

      const token = await loginAdmin(app)

      const { statusCode, body } = await supertest(app)
        .get('/api/v1/users/')
        .auth(token, { type: 'bearer' })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        data: expect.any(Array),
      })
    })
  })
})
