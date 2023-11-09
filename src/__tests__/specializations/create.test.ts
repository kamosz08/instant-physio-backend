import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../createServer'
import { loginUser } from '../../testUtils/loginUser'
import { loginSpecialist } from '../../testUtils/loginSpecialist'

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

      const token = await loginUser(app)

      const { statusCode } = await supertest(app)
        .post('/api/v1/specializations/')
        .auth(token, { type: 'bearer' })
        .send({ name: 'Some name', description: 'Some description' })

      expect(statusCode).toBe(403)
    })
  })

  describe('given authenticated and authorized user(specialist)', () => {
    it('should return a 200 status', async () => {
      const app = createServer()

      const token = await loginSpecialist(app)

      const { statusCode } = await supertest(app)
        .post('/api/v1/specializations/')
        .auth(token, { type: 'bearer' })
        .send({ name: 'Some name', description: 'Some description' })

      expect(statusCode).toBe(201)
    })
  })
})