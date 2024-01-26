import createServer from '../factories/createServer'
import supertest from 'supertest'

type AppType = ReturnType<typeof createServer>

export const loginSpecialist = async (
  app: AppType
): Promise<{
  accessToken: string
  refreshToken: string
  expireTime: number
}> => {
  const response = await supertest(app).post('/api/v1/users/login').send({
    username: 'testspecialist@example.com',
    password: 'test',
  })

  const newRefreshToken = response
    .get('Set-Cookie')[0]
    .split(';')
    .find((s) => s.includes('refreshToken'))
    .split('=')[1]
  const body = response.body

  return {
    accessToken: body.accessToken,
    refreshToken: newRefreshToken,
    expireTime: body.expireTime,
  }
}
