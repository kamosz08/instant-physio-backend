import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'

describe('update meeting status', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .patch(`/api/v1/meetings/1`)
        .send({ status: 'canceled' })

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated user', () => {
    describe('who wants to cancel another users meetings', () => {
      it('should return a 403 status', async () => {
        const app = createServer()

        const { accessToken } = await loginUser(app)

        const { statusCode } = await supertest(app)
          .patch(`/api/v1/meetings/3`)
          .send({ status: 'canceled' })
          .auth(accessToken, { type: 'bearer' })

        expect(statusCode).toBe(403)
      })
    })

    describe('who wants to cancel his own meeting', () => {
      it('should return a 201 status and data', async () => {
        const app = createServer()

        const { accessToken } = await loginUser(app)

        const { statusCode } = await supertest(app)
          .patch(`/api/v1/meetings/2`)
          .send({ status: 'canceled' })
          .auth(accessToken, { type: 'bearer' })

        expect(statusCode).toBe(201)
      })
    })
  })
})
