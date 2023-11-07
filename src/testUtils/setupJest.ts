import { afterAll, beforeAll } from '@jest/globals'
import { db } from '../db'

beforeAll(async () => {
  await db.migrate.latest()
  await db.seed.run()
})

afterAll(async () => {
  await db.raw(`DROP DATABASE ${process.env.DB_NAME};`)
  await db.destroy()
})
