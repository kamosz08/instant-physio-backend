import { createClient } from 'redis'

export function cacheCreator() {
  let client
  let initialized = false
  const initialize = async (mock = false) => {
    if (mock) {
      client = createClient()
      initialized = true

      return
    }
    client = await createClient({
      socket: { host: process.env.CACHE_HOSTNAME },
    })
      .on('error', (err) => {
        console.log('Redis Client Error', err)
        throw new Error('Redis Client Error')
      })
      .connect()

    initialized = true
  }

  const getClient = () => {
    if (!initialized) {
      throw new Error('Redis Client called before initialization')
    }
    return client as ReturnType<typeof createClient>
  }

  return { initialize, getClient }
}
