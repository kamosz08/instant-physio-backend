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
    describe('given no query params', () => {
      it('should return a 200 status and data', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode, body } = await supertest(app)
          .get('/api/v1/users/specialists')
          .auth(token, { type: 'bearer' })

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          data: expect.any(Array),
          isLast: expect.any(Boolean),
          page: expect.any(Number),
          limit: expect.any(Number),
        })
        expect(body.data.length).toBeGreaterThanOrEqual(1)
      })
    })
    describe('given search query param', () => {
      it('should return a 200 status and data', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode, body } = await supertest(app)
          .get('/api/v1/users/specialists?search=five')
          .auth(token, { type: 'bearer' })

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          data: expect.any(Array),
          isLast: expect.any(Boolean),
          page: expect.any(Number),
          limit: expect.any(Number),
        })
        expect(body.data.length).toBeGreaterThanOrEqual(1)
      })
      it('should return a 200 status and empty data', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode, body } = await supertest(app)
          .get('/api/v1/users/specialists?search=somenonexistingtext')
          .auth(token, { type: 'bearer' })

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          data: expect.any(Array),
          isLast: expect.any(Boolean),
          page: expect.any(Number),
          limit: expect.any(Number),
        })
        expect(body.data.length).toBe(0)
      })
    })
    describe('given filters query param', () => {
      it('should return a 200 status and data', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode, body } = await supertest(app)
          .get('/api/v1/users/specialists?specialization=1')
          .auth(token, { type: 'bearer' })

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          data: expect.any(Array),
          isLast: expect.any(Boolean),
          page: expect.any(Number),
          limit: expect.any(Number),
        })
        expect(body.data.length).toBeGreaterThanOrEqual(1)
      })
    })
    describe('given filters query param with non existing specialization', () => {
      it('should return a 404 status', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode } = await supertest(app)
          .get('/api/v1/users/specialists?specialization=1001')
          .auth(token, { type: 'bearer' })

        expect(statusCode).toBe(404)
      })
    })
    describe('given search and filters query param', () => {
      it('should return a 200 status and data', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode, body } = await supertest(app)
          .get('/api/v1/users/specialists?specialization=1&search=five')
          .auth(token, { type: 'bearer' })

        expect(statusCode).toBe(200)
        expect(body).toEqual({
          data: expect.any(Array),
          isLast: expect.any(Boolean),
          page: expect.any(Number),
          limit: expect.any(Number),
        })
        expect(body.data.length).toBeGreaterThanOrEqual(1)
      })
    })
  })
})
