import createServer from '../createServer'
import supertest from 'supertest'

type AppType = ReturnType<typeof createServer>

export const loginSpecialist = async (app: AppType): Promise<string> => {
  const { body } = await supertest(app).post('/api/v1/users/login').send({
    email: 'testspecialist@example.com',
    password: 'test',
  })

  return body.token
}
