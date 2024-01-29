import { redisClientCreator } from './factories/createRedis'

const redisClientCtr = redisClientCreator()

export const initRedisClient = redisClientCtr.initialize
export const getRedis = redisClientCtr.getClient
