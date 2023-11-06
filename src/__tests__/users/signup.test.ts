import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../createServer'

describe('user registration', () => {
  describe('given the username and password are valid', () => {
    it('should return a 200 status and jwt token', async () => {
      const app = createServer()

      const { statusCode, body } = await supertest(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'Test',
          email: 'test1@gmail.com',
          password: 'password',
          description: 'Hi thewdre',
          type: 'user',
        })

      expect(statusCode).toBe(200) //TODO: change to 201?

      expect(body).toEqual({
        token: expect.any(String),
      })
    })
  })

  describe('given wrong payload', () => {
    it('should return a 400', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'test1@gmail.com',
          password: 'password',
          description: 'Hi thewdre',
          type: 'user',
        })

      expect(statusCode).toBe(400)
    })
  })
})
