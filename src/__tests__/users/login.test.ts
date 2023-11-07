import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../createServer'

describe('user login', () => {
  describe('given the email and password are valid', () => {
    it('should return a 200 status and jwt token', async () => {
      const app = createServer()

      const { statusCode, body } = await supertest(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@example.com',
          password: 'test',
        })

      expect(statusCode).toBe(200)

      expect(body).toEqual({
        token: expect.any(String),
      })
    })
  })

  describe('given the email is invalid', () => {
    it('should return a 400 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/login')
        .send({
          email: 'wrong@example.com',
          password: 'test',
        })

      expect(statusCode).toBe(400)
    })
  })

  describe('given the password is invalid', () => {
    it('should return a 400 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrong',
        })

      expect(statusCode).toBe(400)
    })
  })
})
