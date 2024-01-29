import { initRedisClient } from '../cache'

// eslint-disable-next-line prettier/prettier
(async function () {
  await initRedisClient(true)
})()
