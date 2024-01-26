import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'
import { loginSpecialist } from '../../testUtils/loginSpecialist'
import path from 'path'

describe('create specialization', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/specializations/')
        .send({ name: 'Some name', description: 'Some description' })

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated but not authorized user', () => {
    it('should return a 403 status', async () => {
      const app = createServer()

      const { accessToken } = await loginUser(app)

      const { statusCode } = await supertest(app)
        .post('/api/v1/specializations/')
        .auth(accessToken, { type: 'bearer' })
        .send({ name: 'Some name', description: 'Some description' })

      expect(statusCode).toBe(403)
    })
  })

  describe('given authenticated and authorized user(specialist)', () => {
    it('should return a 200 status', async () => {
      const app = createServer()

      const { accessToken } = await loginSpecialist(app)

      const { statusCode } = await supertest(app)
        .post('/api/v1/specializations/')
        .auth(accessToken, { type: 'bearer' })
        .type('form')
        .field('name', 'Test name')
        .field('description', 'Test description')
        .field('slug', 'test-name')
        .field('benefits', 'Benefit 1;Benefit 2')
        .field('type', 'user')
        .attach('benefitsPhoto', path.resolve(__dirname, './test.jpg'))
        .attach('mainPhoto', path.resolve(__dirname, './test.jpg'))

      expect(statusCode).toBe(201)
    })
  })
})
