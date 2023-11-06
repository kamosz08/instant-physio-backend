import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../createServer'

describe('user login', () => {
  describe('given the username and password are valid', () => {
    it('should return a 200 status and jwt token', async () => {
      const app = createServer()

      //TODO: seed db for this to work
      const { statusCode, body } = await supertest(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test1@gmail.com',
          password: 'password',
        })

      expect(statusCode).toBe(200)

      expect(body).toEqual({
        token: expect.any(String),
      })
    })
  })
})
