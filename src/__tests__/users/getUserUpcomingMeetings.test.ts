import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'

describe('get user upcoming meetings', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const userId = 5
      const { statusCode } = await supertest(app).get(
        `/api/v1/users/${userId}/meetings/upcoming`
      )

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated user', () => {
    describe('who wants to see another user meetings', () => {
      it('should return a 403 status', async () => {
        const app = createServer()

        const { accessToken } = await loginUser(app)

        const userId = 6

        const { statusCode } = await supertest(app)
          .get(`/api/v1/users/${userId}/meetings/upcoming`)
          .auth(accessToken, { type: 'bearer' })

        expect(statusCode).toBe(403)
      })
    })

    describe('who wants to see his own meetings', () => {
      it('should return a 200 status and data', async () => {
        const app = createServer()

        const { accessToken } = await loginUser(app)

        const userId = 3

        const { statusCode, body } = await supertest(app)
          .get(`/api/v1/users/${userId}/meetings/upcoming`)
          .auth(accessToken, { type: 'bearer' })

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          data: expect.any(Array),
        })
      })
    })

    describe('who wants to see specialist meetings', () => {
      it('should return a 200 status and data', async () => {
        const app = createServer()

        const { accessToken } = await loginUser(app)

        const userId = 5

        const { statusCode, body } = await supertest(app)
          .get(`/api/v1/users/${userId}/meetings/upcoming`)
          .auth(accessToken, { type: 'bearer' })

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          data: expect.any(Array),
        })
      })
    })
  })
})
