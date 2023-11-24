import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'

describe('user login', () => {
  describe('given the username and password are valid', () => {
    it('should return a 200 status and jwt token', async () => {
      const app = createServer()

      const { statusCode, body } = await supertest(app)
        .post('/api/v1/users/login')
        .send({
          username: 'test@example.com',
          password: 'test',
        })

      expect(statusCode).toBe(200)

      expect(body).toEqual({
        token: expect.any(String),
      })
    })
  })

  describe('given the username is invalid', () => {
    it('should return a 400 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/login')
        .send({
          username: 'wrong@example.com',
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
          username: 'test@example.com',
          password: 'wrong',
        })

      expect(statusCode).toBe(400)
    })
  })
})
