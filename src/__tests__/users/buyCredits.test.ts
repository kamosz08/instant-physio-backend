import { describe, expect, it } from '@jest/globals'
import supertest from 'supertest'
import createServer from '../../factories/createServer'
import { loginUser } from '../../testUtils/loginUser'

describe('buy credits', () => {
  describe('given signed in user', () => {
    it('should return a 200 status and add credits', async () => {
      const app = createServer()
      const { accessToken } = await loginUser(app)

      const { body: getBody } = await supertest(app)
        .get('/api/v1/users/me')
        .auth(accessToken, { type: 'bearer' })

      expect(getBody?.data?.credits).toEqual(120)

      const { statusCode, body } = await supertest(app)
        .post('/api/v1/users/buyCredits')
        .auth(accessToken, { type: 'bearer' })
        .send({
          credits: 10,
        })

      expect(statusCode).toEqual(200)
      expect(body?.data?.credits).toEqual(130)
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
