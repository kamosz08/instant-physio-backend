import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'
import { loginAdmin } from '../../testUtils/loginAdmin'

describe('assign specialization to user', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/5/specialization')
        .send({ id: 1 })

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated but not authorized user', () => {
    it('should return a 403 status', async () => {
      const app = createServer()

      const { accessToken } = await loginUser(app)

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/5/specialization')
        .auth(accessToken, { type: 'bearer' })
        .send({ id: 1 })

      expect(statusCode).toBe(403)
    })
  })

  describe('given authenticated and authorized user with admin rights', () => {
    describe('given wrong payload structure', () => {
      it('should return a 400 status', async () => {
        const app = createServer()

        const {accessToken} = await loginAdmin(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/5/specialization')
          .auth(accessToken, { type: 'bearer' })
          .send({ somethingwrong: 1 })

        expect(statusCode).toBe(400)
      })
    })
    describe('given non existing specialization', () => {
      it('should return a 404 status', async () => {
        const app = createServer()

        const {accessToken} = await loginAdmin(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/5/specialization')
          .auth(accessToken, { type: 'bearer' })
          .send({ id: 101 })

        expect(statusCode).toBe(404)
      })
    })
    describe('given non existing user', () => {
      it('should return a 404 status', async () => {
        const app = createServer()

        const {accessToken} = await loginAdmin(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/505/specialization')
          .auth(accessToken, { type: 'bearer' })
          .send({ id: 1 })

        expect(statusCode).toBe(404)
      })
    })
    describe('given correct payload and user id', () => {
      it('should return a 204 status', async () => {
        const app = createServer()

        const {accessToken} = await loginAdmin(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/7/specialization')
          .auth(accessToken, { type: 'bearer' })
          .send({ id: 1 })

        expect(statusCode).toBe(204)
      })
    })
  })
})
