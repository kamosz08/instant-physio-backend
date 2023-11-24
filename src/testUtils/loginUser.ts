import createServer from '../factories/createServer'
import supertest from 'supertest'

type AppType = ReturnType<typeof createServer>

export const loginUser = async (app: AppType): Promise<string> => {
  const { body } = await supertest(app).post('/api/v1/users/login').send({
    username: 'test@example.com',
    password: 'test',
  })

  return body.token
}
