import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../createServer'
import { loginUser } from '../../testUtils/loginUser'
import { set } from 'date-fns'
import { formatSpecialistWorkTime } from '../../utils/formatSpecialistWorkTime'

const getDateInFuture = ({ hours }: { hours: number }) => {
  const futureYear = new Date().getFullYear() + 1
  const tomorrow = set(new Date(), {
    year: futureYear,
    month: 1,
    date: 1,
    hours,
    minutes: 0,
  })
  return formatSpecialistWorkTime(tomorrow)
}

describe('create meeting', () => {
  describe('given unauthenticated user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/meetings/')
        .send({
          invitedUserId: 5,
          start_time: getDateInFuture({ hours: 9 }),
          end_time: getDateInFuture({ hours: 10 }),
        })

      expect(statusCode).toBe(401)
    })
  })

  describe('given authenticated user', () => {
    describe('given non existing invited user id', () => {
      it('should return a 400 status', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/meetings/')
          .auth(token, { type: 'bearer' })
          .send({
            invitedUserId: 500,
            start_time: getDateInFuture({ hours: 9 }),
            end_time: getDateInFuture({ hours: 10 }),
          })

        expect(statusCode).toBe(400)
      })
    })

    describe('given incomplete payload', () => {
      it('should return a 400 status', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/meetings/')
          .auth(token, { type: 'bearer' })
          .send({
            start_time: getDateInFuture({ hours: 9 }),
            end_time: getDateInFuture({ hours: 10 }),
          })

        expect(statusCode).toBe(400)
      })
    })

    describe('given correct payload', () => {
      it('should return a 201 status', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/meetings/')
          .auth(token, { type: 'bearer' })
          .send({
            invitedUserId: 5,
            start_time: getDateInFuture({ hours: 9 }),
            end_time: getDateInFuture({ hours: 10 }),
          })

        expect(statusCode).toBe(201)
      })
    })

    describe('given correct payload send twice', () => {
      it('should return a 201 status then 400 status because of meeting overlap', async () => {
        const app = createServer()

        const token = await loginUser(app)

        const { statusCode } = await supertest(app)
          .post('/api/v1/meetings/')
          .auth(token, { type: 'bearer' })
          .send({
            invitedUserId: 5,
            start_time: getDateInFuture({ hours: 10 }),
            end_time: getDateInFuture({ hours: 11 }),
          })

        expect(statusCode).toBe(201)

        const { statusCode: secondStatusCode } = await supertest(app)
          .post('/api/v1/meetings/')
          .auth(token, { type: 'bearer' })
          .send({
            invitedUserId: 5,
            start_time: getDateInFuture({ hours: 10 }),
            end_time: getDateInFuture({ hours: 11 }),
          })

        expect(secondStatusCode).toBe(400)
      })
    })
  })
})
