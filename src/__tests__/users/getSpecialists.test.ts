import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'

describe('get specialists', () => {
  describe('given no query params', () => {
    it('should return a 200 status and data', async () => {
      const app = createServer()

      const { statusCode, body } = await supertest(app).get(
        '/api/v1/users/specialists'
      )

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

      const { statusCode, body } = await supertest(app).get(
        '/api/v1/users/specialists?search=five'
      )

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

      const { statusCode, body } = await supertest(app).get(
        '/api/v1/users/specialists?search=somenonexistingtext'
      )

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

      const { statusCode, body } = await supertest(app).get(
        '/api/v1/users/specialists?specialization=1'
      )

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        data: expect.any(Array),
        isLast: expect.any(Boolean),
        page: expect.any(Number),
        limit: expect.any(Number),
      })
      expect(body.data.length).toBeGreaterThanOrEqual(1)
    })
    it('should return a 200 status and data', async () => {
      const app = createServer()

      const { statusCode, body } = await supertest(app).get(
        '/api/v1/users/specialists?specialization=1&gender=male'
      )

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

      const { statusCode, body } = await supertest(app).get(
        '/api/v1/users/specialists?specialization=1&gender=female'
      )

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
  describe('given search and filters query param', () => {
    it('should return a 200 status and data', async () => {
      const app = createServer()

      const { statusCode, body } = await supertest(app).get(
        '/api/v1/users/specialists?specialization=1&search=five'
      )

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
