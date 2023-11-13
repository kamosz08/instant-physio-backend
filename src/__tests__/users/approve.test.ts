/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'
import { loginAdmin } from '../../testUtils/loginAdmin'
import { Specialist, User } from '../../types/db'

const getSpecialistStatus = (data: any, id: number) => {
  return (data as (Specialist & User)[]).find((user) => user.id === id)!.status
}

describe('approve specialist', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/approve')
        .send({
          id: 2,
        })

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated but not authorized user', () => {
    it('should return a 403 status', async () => {
      const app = createServer()

      const token = await loginUser(app)

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/approve')
        .auth(token, { type: 'bearer' })
        .send({
          id: 2,
        })

      expect(statusCode).toBe(403)
    })
  })

  describe('given authenticated and authorized user with admin rights', () => {
    describe('given not existing user id', () => {
      it('should return a 404 status', async () => {
        const app = createServer()

        const token = await loginAdmin(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/approve')
          .auth(token, { type: 'bearer' })
          .send({
            id: 400,
          })

        expect(statusCode).toBe(404)
      })
    })

    describe('given not specialist user id', () => {
      it('should return a 400 status', async () => {
        const app = createServer()

        const token = await loginAdmin(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/approve')
          .auth(token, { type: 'bearer' })
          .send({
            id: 1,
          })

        expect(statusCode).toBe(400)
      })
    })

    describe('given wrong payload', () => {
      it('should return a 400 status', async () => {
        const app = createServer()

        const token = await loginAdmin(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/approve')
          .auth(token, { type: 'bearer' })
          .send({
            wrong: 2,
          })

        expect(statusCode).toBe(400)
      })
    })

    describe('given correct payload', () => {
      it('should return a 204 status and update specialist status field', async () => {
        const app = createServer()

        const token = await loginAdmin(app)

        const { body: beforeUsers } = await supertest(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })

        const specialistStatus = getSpecialistStatus(beforeUsers.data, 2)
        expect(specialistStatus).toEqual('waiting_approval')

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/approve')
          .auth(token, { type: 'bearer' })
          .send({
            id: 2,
          })

        expect(statusCode).toBe(204)

        const { body: afterUsers } = await supertest(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })

        const finalSpecialistStatus = getSpecialistStatus(afterUsers.data, 2)
        expect(finalSpecialistStatus).toEqual('active')
      })
    })
  })
})
