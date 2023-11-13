import { knex } from 'knex'
import config from '../../../knexfile'
import { beforeAll } from '@jest/globals'
import { getDbConfigName } from '../../createDatabaseConnection'

// Init connect knex and create DB
beforeAll(async () => {
  const configuration = config[getDbConfigName()]

  const testConfig = {
    ...configuration,
    connection: { ...(configuration.connection as any), database: null },
  }
  const knexInstance = knex(testConfig)

  await knexInstance.raw(`DROP DATABASE IF EXISTS ${process.env.DB_NAME};`)

  await knexInstance.raw(`CREATE DATABASE ${process.env.DB_NAME};`)
  await knexInstance.destroy()
})
