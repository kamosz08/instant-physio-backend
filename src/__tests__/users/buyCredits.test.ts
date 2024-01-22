import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'

describe('buy credits', () => {
  describe('given signed in user', () => {
    it('should return a 201 status and add credits', async () => {
      const app = createServer()
      const token = await loginUser(app)

      const { body } = await supertest(app)
        .get('/api/v1/users/me')
        .auth(token, { type: 'bearer' })

      expect(body?.data?.credits).toEqual(0)

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/buyCredits')
        .auth(token, { type: 'bearer' })
        .send({
          credits: 10,
        })

      expect(statusCode).toEqual(201)

      const { body: bodyAfterBuy } = await supertest(app)
        .get('/api/v1/users/me')
        .auth(token, { type: 'bearer' })

      expect(bodyAfterBuy?.data?.credits).toEqual(10)
    })
  })

  describe('given not signed in user', () => {
    it('should return a 401 status', async () => {
      const app = createServer()

      const { statusCode } = await supertest(app)
        .post('/api/v1/users/buyCredits')
        .send({
          credits: 10,
        })

      expect(statusCode).toBe(401)
    })
  })
})
