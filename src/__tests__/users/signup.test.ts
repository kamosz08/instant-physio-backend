import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import path from 'path'

describe('user registration', () => {
  describe('given the username and password are valid', () => {
    it('should return a 200 status and jwt token', async () => {
      const app = createServer()

      const { statusCode, body } = await supertest(app)
        .post('/api/v1/users/signup')
        .type('form')
        .field('name', 'Test')
        .field('username', 'test1@gmail.com')
        .field('password', 'password')
        .field('description', 'Hi thewdre')
        .field('type', 'user')
        .field('gender', 'male')
        .attach('avatar', path.resolve(__dirname, './test.jpg'))

      expect(statusCode).toBe(200)

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
          username: 'test1@gmail.com',
          password: 'password',
          description: 'Hi thewdre',
          type: 'user',
        })

      expect(statusCode).toBe(400)
    })
  })
})
